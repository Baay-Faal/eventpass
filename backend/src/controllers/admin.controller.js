/**
 * Controller d'Administration
 * 
 * Toutes les fonctions ici nécessitent le rôle ADMIN (vérifié par les middlewares).
 * L'admin gère les comptes "privés" : les organisateurs et les agents.
 */

const bcrypt = require('bcryptjs');
const { User, Event, Ticket, Scan } = require('../models');

// ─── GESTION DES ORGANISATEURS ─────────────────────────────────────────

// GET /api/admin/organizers
const getOrganizers = async (req, res) => {
  try {
    const organizers = await User.findAll({
      where: { role: 'ORGANIZER' },
      attributes: { exclude: ['password'] }, // Ne jamais renvoyer les mots de passe
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: organizers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// POST /api/admin/organizers
const createOrganizer = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Champs manquants.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Cet email existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOrganizer = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'ORGANIZER',
    });

    const userToReturn = newOrganizer.toJSON();
    delete userToReturn.password;

    res.status(201).json({
      success: true,
      message: 'Organisateur créé avec succès.',
      data: userToReturn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PUT /api/admin/organizers/:id
const updateOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const organizer = await User.findOne({ where: { id, role: 'ORGANIZER' } });
    if (!organizer) {
      return res.status(404).json({ success: false, message: 'Organisateur introuvable.' });
    }

    await organizer.update({ firstName, lastName, email });

    const updatedUser = organizer.toJSON();
    delete updatedUser.password;

    res.json({
      success: true,
      message: 'Organisateur mis à jour.',
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PATCH /api/admin/organizers/:id/status
// Active ou désactive un compte (soft ban)
const toggleOrganizerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body; // true ou false

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive doit être un booléen.' });
    }

    const organizer = await User.findOne({ where: { id, role: 'ORGANIZER' } });
    if (!organizer) {
      return res.status(404).json({ success: false, message: 'Organisateur introuvable.' });
    }

    await organizer.update({ isActive });

    res.json({
      success: true,
      message: `Compte ${isActive ? 'activé' : 'désactivé'}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ─── GESTION DES AGENTS ────────────────────────────────────────────────

// GET /api/admin/agents
const getAgents = async (req, res) => {
  try {
    const agents = await User.findAll({
      where: { role: 'AGENT' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: agents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// POST /api/admin/agents
const createAgent = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Champs manquants.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Cet email existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'AGENT',
    });

    const userToReturn = newAgent.toJSON();
    delete userToReturn.password;

    res.status(201).json({
      success: true,
      message: 'Agent créé avec succès.',
      data: userToReturn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// PATCH /api/admin/agents/:id/status
const toggleAgentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive doit être un booléen.' });
    }

    const agent = await User.findOne({ where: { id, role: 'AGENT' } });
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent introuvable.' });
    }

    await agent.update({ isActive });

    res.json({
      success: true,
      message: `Agent ${isActive ? 'activé' : 'désactivé'}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ─── STATISTIQUES GLOBALES ─────────────────────────────────────────────

// GET /api/admin/stats
const getGlobalStats = async (req, res) => {
  try {
    const organizers = await User.count({ where: { role: 'ORGANIZER' } });
    const events = await Event.count();
    const tickets = await Ticket.count();
    const scans = await Scan.count();

    // Calcul détaillé
    const allEvents = await Event.findAll({
      include: [
        { model: Ticket, as: 'tickets', attributes: ['id'] },
        { model: User, as: 'organizer', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    let totalRevenue = 0;
    const eventStats = [];
    const organizerRevenue = {};

    allEvents.forEach(evt => {
      const ticketsSold = evt.tickets ? evt.tickets.length : 0;
      const revenue = ticketsSold * evt.price;
      totalRevenue += revenue;

      eventStats.push({
        id: evt.id,
        title: evt.title,
        ticketsSold,
        revenue
      });

      if (evt.organizer) {
        const orgKey = `${evt.organizer.firstName} ${evt.organizer.lastName}`;
        if (!organizerRevenue[orgKey]) organizerRevenue[orgKey] = 0;
        organizerRevenue[orgKey] += revenue;
      }
    });

    // Formater organizerRevenue en tableau pour le frontend
    const organizerStats = Object.keys(organizerRevenue).map(name => ({
      name,
      revenue: organizerRevenue[name]
    })).sort((a, b) => b.revenue - a.revenue);

    res.json({
      success: true,
      data: {
        totalOrganizers: organizers,
        totalEvents: events,
        totalTickets: tickets,
        totalScans: scans,
        totalRevenue,
        eventStats: eventStats.sort((a, b) => b.revenue - a.revenue),
        organizerStats
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = {
  getOrganizers,
  createOrganizer,
  updateOrganizer,
  toggleOrganizerStatus,
  getAgents,
  createAgent,
  toggleAgentStatus,
  getGlobalStats,
};
