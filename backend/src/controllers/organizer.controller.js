/**
 * Controller Organisateur
 * 
 * Permet à un organisateur de gérer SES événements.
 * Un événement passe par un cycle de vie : DRAFT → PUBLISHED.
 */

const { Event } = require('../models');

// GET /api/organizer/events
// Liste tous les événements de l'organisateur connecté
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { organizerId: req.user.id }, // Uniquement les siens
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// POST /api/organizer/events
// Création d'un événement (démarre toujours en statut DRAFT)
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, venue, address, capacity, price } = req.body;

    // Si une image a été uploadée, multer l'a mise dans req.file
    // On sauvegarde uniquement le nom du fichier en base
    const image = req.file ? req.file.filename : null;

    if (!title || !description || !category || !date || !venue || !address || !capacity || !price) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires.' });
    }

    const newEvent = await Event.create({
      title,
      description,
      category,
      date,
      venue,
      address,
      capacity,
      price,
      image,
      status: 'DRAFT', // Forcé à DRAFT à la création
      organizerId: req.user.id, // L'ID vient du token JWT (authMiddleware)
    });

    res.status(201).json({
      success: true,
      message: 'Événement créé en brouillon (DRAFT).',
      data: newEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PUT /api/organizer/events/:id
// Modifie un événement (uniquement s'il est en DRAFT)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que l'événement lui appartient
    const event = await Event.findOne({ where: { id, organizerId: req.user.id } });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement introuvable.' });
    }

    if (event.status !== 'DRAFT') {
      return res.status(400).json({ success: false, message: 'Seuls les événements en brouillon peuvent être modifiés.' });
    }

    // Mise à jour des champs
    const updateData = { ...req.body };
    
    // Si une nouvelle image a été uploadée, on met à jour le champ image
    if (req.file) {
      updateData.image = req.file.filename;
    }

    await event.update(updateData);

    res.json({
      success: true,
      message: 'Événement mis à jour.',
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PATCH /api/organizer/events/:id/publish
// Passe l'événement de DRAFT à PUBLISHED
const publishEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findOne({ where: { id, organizerId: req.user.id } });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement introuvable.' });
    }

    if (event.status !== 'DRAFT') {
      return res.status(400).json({ success: false, message: 'Cet événement n\'est pas en brouillon.' });
    }

    await event.update({ status: 'PUBLISHED' });

    res.json({
      success: true,
      message: 'Événement publié ! Les visiteurs peuvent maintenant acheter des billets.',
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PATCH /api/organizer/events/:id/cancel
// Annule l'événement
const cancelEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findOne({ where: { id, organizerId: req.user.id } });
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement introuvable.' });
    }

    if (event.status === 'CANCELLED' || event.status === 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Cet événement ne peut plus être annulé.' });
    }

    await event.update({ status: 'CANCELLED' });

    res.json({
      success: true,
      message: 'Événement annulé.',
      data: event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = {
  getMyEvents,
  createEvent,
  updateEvent,
  publishEvent,
  cancelEvent,
};
