/**
 * Controller Organisateur
 * 
 * Permet à un organisateur de gérer SES événements.
 * Un événement passe par un cycle de vie : DRAFT → PUBLISHED.
 */

const { Event, Ticket, User } = require('../models');

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
    const { title, description, category, date, venue, address, capacity, price, requiresApproval } = req.body;

    // Si une image a été uploadée, multer l'a mise dans req.file
    // On sauvegarde uniquement le nom du fichier en base
    const image = req.file ? req.file.filename : null;

    if (!title || !description || !category || !date || !venue || !address || !capacity || !price) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires.' });
    }

    const isApprovalRequired = requiresApproval === 'true' || requiresApproval === true;

    // LIMITE : 150 places max pour les événements privés
    if (isApprovalRequired && capacity > 150) {
      return res.status(400).json({ success: false, message: 'Un événement privé ne peut pas dépasser 150 places.' });
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
      requiresApproval: isApprovalRequired,
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
    
    if (updateData.requiresApproval !== undefined) {
      updateData.requiresApproval = updateData.requiresApproval === 'true' || updateData.requiresApproval === true;
    }

    // LIMITE : 150 places max pour les événements privés
    const finalRequiresApproval = updateData.requiresApproval !== undefined ? updateData.requiresApproval : event.requiresApproval;
    const finalCapacity = updateData.capacity !== undefined ? parseInt(updateData.capacity, 10) : event.capacity;
    
    if (finalRequiresApproval && finalCapacity > 150) {
      return res.status(400).json({ success: false, message: 'Un événement privé ne peut pas dépasser 150 places.' });
    }

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

// GET /api/organizer/dashboard
// Statistiques globales de l'organisateur (billets vendus, revenus, taux de scan)
const getDashboardStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // 1. Récupérer tous les événements de l'organisateur
    const events = await Event.findAll({
      where: { organizerId },
      include: [
        {
          model: Ticket,
          as: 'tickets',
          // On ne compte que les billets valides ou utilisés (pas les annulés)
          where: { status: ['VALID', 'USED'] },
          required: false, // LEFT JOIN (pour inclure les événements sans billets)
        }
      ]
    });

    let totalCapacity = 0;
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    let totalScanned = 0;

    // 2. Parcourir les événements pour calculer les stats
    events.forEach(event => {
      totalCapacity += event.capacity;
      
      const ticketsSold = event.tickets.length;
      totalTicketsSold += ticketsSold;
      
      // Revenu = billets vendus * prix de l'événement
      totalRevenue += (ticketsSold * parseFloat(event.price));

      // Billets scannés à l'entrée
      const scannedTickets = event.tickets.filter(t => t.status === 'USED').length;
      totalScanned += scannedTickets;
    });

    // 3. Calcul du taux de présence (scan)
    const scanRate = totalTicketsSold > 0 
      ? Math.round((totalScanned / totalTicketsSold) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        totalEvents: events.length,
        totalCapacity,
        totalTicketsSold,
        totalRevenue,
        totalScanned,
        scanRate: `${scanRate}%`,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// GET /api/organizer/events/:id/tickets
// Liste tous les billets pour un événement précis
const getEventTickets = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que l'événement appartient à l'organisateur
    const event = await Event.findOne({ where: { id, organizerId: req.user.id } });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement introuvable.' });
    }

    const tickets = await Ticket.findAll({
      where: { eventId: id },
      include: [{
        model: User,
        as: 'user', // L'alias défini dans l'association
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['purchasedAt', 'DESC']]
    });

    res.json({ success: true, data: tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PATCH /api/organizer/tickets/:id/approve
// Approuve un billet en attente
const approveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByPk(id, {
      include: [{ model: Event, as: 'event' }]
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Billet introuvable.' });
    }

    if (ticket.event.organizerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé.' });
    }

    if (ticket.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Ce billet n\'est pas en attente d\'approbation.' });
    }

    await ticket.update({ status: 'VALID' });

    res.json({ success: true, message: 'Billet approuvé avec succès.', data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PATCH /api/organizer/tickets/:id/reject
// Refuse un billet en attente
const rejectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByPk(id, {
      include: [{ model: Event, as: 'event' }]
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Billet introuvable.' });
    }

    if (ticket.event.organizerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Accès non autorisé.' });
    }

    if (ticket.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Ce billet n\'est pas en attente d\'approbation.' });
    }

    await ticket.update({ status: 'CANCELLED' });

    res.json({ success: true, message: 'Billet refusé.', data: ticket });
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
  getDashboardStats,
  getEventTickets,
  approveTicket,
  rejectTicket,
};
