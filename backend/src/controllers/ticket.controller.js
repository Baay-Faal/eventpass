/**
 * Controller des Billets (Tickets)
 * 
 * Gère l'achat, l'affichage et l'annulation des billets.
 * S'assure que la règle métier "Max 3 billets par personne par événement" est respectée.
 */

const crypto = require('crypto');
const { Ticket, Event, User, sequelize } = require('../models');
const qrService = require('../services/qr.service');

// Fonction utilitaire pour générer un code de billet (ex: EVP-4F9A2B)
const generateTicketCode = () => {
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `EVP-${randomStr}`;
};

// Fonction utilitaire pour générer le secret du QR code
const generateQrSecret = () => {
  return crypto.randomBytes(16).toString('hex');
};

// POST /api/tickets/purchase
const purchaseTickets = async (req, res) => {
  // On utilise une transaction pour s'assurer que si l'achat de 3 billets plante au milieu,
  // rien n'est sauvegardé en base (tout ou rien).
  const t = await sequelize.transaction();

  try {
    const { eventId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'ID de l\'événement requis.' });
    }

    if (quantity < 1 || quantity > 3) {
      return res.status(400).json({ success: false, message: 'Vous pouvez acheter entre 1 et 3 billets maximum à la fois.' });
    }

    // 1. Vérifier que l'événement existe et est publié
    const event = await Event.findByPk(eventId, { transaction: t });
    if (!event) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Événement introuvable.' });
    }
    if (event.status !== 'PUBLISHED') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Cet événement n\'est pas ouvert à la billetterie.' });
    }

    // NOUVEAU: Vérifier que l'événement n'est pas passé
    if (new Date(event.date) < new Date()) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Cet événement est déjà terminé.' });
    }

    // 2. Vérifier la capacité de l'événement
    const ticketsSold = await Ticket.count({
      where: { eventId, status: ['VALID', 'USED', 'PENDING'] },
      transaction: t,
    });

    if (ticketsSold + quantity > event.capacity) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'L\'événement est complet ou il n\'y a pas assez de places disponibles.' });
    }

    // 3. Vérifier la RÈGLE MÉTIER : Max 3 billets par utilisateur pour cet événement
    const userTicketsCount = await Ticket.count({
      where: { eventId, userId, status: ['VALID', 'USED', 'PENDING'] },
      transaction: t,
    });

    if (userTicketsCount + quantity > 3) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        message: `Limite atteinte. Vous avez déjà ${userTicketsCount} billet(s) pour cet événement (Maximum 3).` 
      });
    }

    // 4. Créer les billets
    const newTickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = await Ticket.create({
        code: generateTicketCode(),
        qrSecret: generateQrSecret(),
        status: event.requiresApproval ? 'PENDING' : 'VALID',
        userId,
        eventId,
      }, { transaction: t });
      
      newTickets.push(ticket);
    }

    // Valider la transaction
    await t.commit();

    res.status(201).json({
      success: true,
      message: `${quantity} billet(s) acheté(s) avec succès !`,
      data: newTickets,
    });
  } catch (error) {
    // Si la moindre erreur se produit, on annule tout
    await t.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'achat.' });
  }
};

// GET /api/tickets/my-tickets
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Event,
          as: 'event',
          attributes: ['title', 'date', 'venue', 'address', 'image'],
        }
      ],
      order: [['purchasedAt', 'DESC']],
    });

    res.json({ success: true, data: tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// GET /api/tickets/:id
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Event,
          as: 'event',
        }
      ],
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Billet introuvable.' });
    }

    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PATCH /api/tickets/:id/cancel
const cancelTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findOne({
      where: { id, userId: req.user.id }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Billet introuvable.' });
    }

    if (ticket.status === 'USED') {
      return res.status(400).json({ success: false, message: 'Ce billet a déjà été utilisé à l\'entrée.' });
    }

    if (ticket.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Ce billet est déjà annulé.' });
    }

    await ticket.update({ status: 'CANCELLED' });

    res.json({ success: true, message: 'Billet annulé avec succès.', data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// GET /api/tickets/:id/qr
// Génère un QR Code dynamique pour un billet
const getTicketQR = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Trouver le billet
    const ticket = await Ticket.findOne({
      where: { id, userId: req.user.id }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Billet introuvable.' });
    }

    if (ticket.status !== 'VALID') {
      return res.status(400).json({ success: false, message: 'Ce billet n\'est pas valide (annulé ou déjà utilisé).' });
    }

    // 2. Générer le payload sécurisé
    const payloadStr = qrService.generateDynamicQRPayload(ticket.id, ticket.qrSecret);

    // 3. Générer l'image Base64
    const qrImageBase64 = await qrService.generateQRCodeImage(payloadStr);

    res.json({
      success: true,
      data: {
        qrCode: qrImageBase64,
        expiresIn: '60s' // Indication pour le frontend : recharger le QR après 60s
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = {
  purchaseTickets,
  getMyTickets,
  getTicketById,
  cancelTicket,
  getTicketQR,
};
