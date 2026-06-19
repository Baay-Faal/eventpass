/**
 * Service de génération et validation de QR Codes
 * 
 * Contient la logique cryptographique HMAC.
 */

const crypto = require('crypto');
const QRCode = require('qrcode');
const config = require('../config/env');

/**
 * Génère le contenu texte du QR Code avec une signature de sécurité.
 * 
 * @param {string} ticketId - L'ID du billet
 * @param {string} ticketSecret - Le secret individuel de ce billet
 * @returns {string} Le JSON stringifié à encoder dans le QR
 */
const generateDynamicQRPayload = (ticketId, ticketSecret) => {
  const timestamp = Date.now();
  
  // Le payload de base contient l'ID du billet et l'heure exacte de génération
  const payloadStr = `${ticketId}:${timestamp}`;

  // On crée la clé de signature en combinant le secret global du serveur
  // et le secret individuel du billet.
  const signingKey = config.qrHmacSecret + ticketSecret;

  // On signe le payload avec HMAC SHA-256
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(payloadStr)
    .digest('hex');

  // L'objet final qui sera encodé dans le QR code
  const qrData = {
    ticketId,
    timestamp,
    signature,
  };

  return JSON.stringify(qrData);
};

/**
 * Convertit des données JSON en image QR Code (Data URL Base64)
 * que le frontend pourra afficher dans une balise <img src="...">
 * 
 * @param {string} dataString - Le JSON stringifié
 * @returns {Promise<string>} Base64 image
 */
const generateQRCodeImage = async (dataString) => {
  try {
    return await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (error) {
    throw new Error('Impossible de générer le QR code');
  }
};

module.exports = {
  generateDynamicQRPayload,
  generateQRCodeImage,
};
