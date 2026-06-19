/**
 * Controller de Check-in
 * 
 * Utilisé par les AGENTS à l'entrée de l'événement.
 * Gère la validation cryptographique des QR Codes et l'historique des scans.
 */

const crypto = require('crypto');
const { Ticket, Scan, Event, User } = require('../models');
const config = require('../config/env');

// POST /api/checkin/scan
const scanTicket = async (req, res) => {
  try {
    const { qrData } = req.body; // C'est le JSON stringifié contenu dans le QR code
    const agentId = req.user.id;

    if (!qrData) {
      return res.status(400).json({ success: false, message: 'Données du QR code manquantes.' });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Format de QR code invalide.' });
    }

    const { ticketId, timestamp, signature } = parsedData;

    if (!ticketId || !timestamp || !signature) {
      return res.status(400).json({ success: false, message: 'Données du QR code incomplètes.' });
    }

    // 1. Chercher le billet en base
    const ticket = await Ticket.findByPk(ticketId, {
      include: [
        { model: Event, as: 'event', attributes: ['title', 'date'] },
        { model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Billet introuvable dans le système.' });
    }

    // Fonction utilitaire pour enregistrer le scan et répondre
    const logScanAndRespond = async (result, statusCode, message) => {
      await Scan.create({
        result,
        ticketId: ticket.id,
        agentId,
      });

      return res.status(statusCode).json({
        success: result === 'SUCCESS',
        result,
        message,
        ticket: {
          code: ticket.code,
          status: ticket.status,
          visitor: `${ticket.user.firstName} ${ticket.user.lastName}`,
          event: ticket.event.title,
        }
      });
    };

    // 2. Vérification cryptographique (Signature HMAC)
    const payloadStr = `${ticketId}:${timestamp}`;
    const signingKey = config.qrHmacSecret + ticket.qrSecret;
    const expectedSignature = crypto
      .createHmac('sha256', signingKey)
      .update(payloadStr)
      .digest('hex');

    if (signature !== expectedSignature) {
      return logScanAndRespond('INVALID', 403, '❌ QR Code falsifié (Signature invalide).');
    }

    // 3. Vérification de l'expiration (Capture d'écran)
    // On tolère 60 secondes (60000 millisecondes) de délai
    const timeDiff = Date.now() - parseInt(timestamp, 10);
    if (timeDiff > 60000 || timeDiff < -5000) { 
      // < -5000 au cas où l'horloge du serveur a une légère désynchronisation
      return logScanAndRespond('EXPIRED', 403, '⏱️ QR Code expiré. Demandez au visiteur de rafraîchir son application.');
    }

    // 4. Vérification du statut du billet
    if (ticket.status === 'CANCELLED') {
      return logScanAndRespond('CANCELLED', 403, '🚫 Ce billet a été annulé par l\'acheteur.');
    }

    if (ticket.status === 'USED') {
      return logScanAndRespond('ALREADY_USED', 403, '⚠️ Ce billet a DÉJÀ été scanné.');
    }

    if (ticket.status !== 'VALID') {
      return logScanAndRespond('INVALID', 400, '❌ Statut du billet invalide.');
    }

    // 5. Tout est bon ! On marque le billet comme USED
    await ticket.update({ status: 'USED' });

    // On loggue le succès
    return logScanAndRespond('SUCCESS', 200, '✅ Billet validé avec succès ! Accès autorisé.');

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors du scan.' });
  }
};

module.exports = {
  scanTicket,
};
