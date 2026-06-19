/**
 * Controller des Événements Publics
 * 
 * Ce controller gère l'affichage public des événements.
 * Contrairement à organizer.controller, ici on ne renvoie QUE les événements en statut PUBLISHED.
 */

const { Op } = require('sequelize');
const { Event, User } = require('../models');

// GET /api/events
// Récupère la liste de tous les événements publiés (avec filtres optionnels)
const getPublicEvents = async (req, res) => {
  try {
    const { category, search, date } = req.query;

    // Condition de base : l'événement doit être publié
    const whereCondition = {
      status: 'PUBLISHED',
    };

    // 1. Filtre par catégorie (ex: ?category=CONCERT)
    if (category) {
      whereCondition.category = category;
    }

    // 2. Recherche textuelle (ex: ?search=rock)
    // Cherche dans le titre OU dans la description
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // 3. Filtre par date (ex: ?date=2026-08-01)
    // On veut les événements qui se passent APRÈS ou LE JOUR de cette date
    if (date) {
      whereCondition.date = {
        [Op.gte]: new Date(date), // gte = Greater Than or Equal
      };
    }

    const events = await Event.findAll({
      where: whereCondition,
      // On inclut les infos de l'organisateur (sans son mot de passe ni role)
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['date', 'ASC']], // On affiche les plus proches en premier
    });

    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// GET /api/events/:id
// Récupère les détails d'un événement spécifique
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      where: { 
        id,
        // On autorise PUBLISHED, mais on peut aussi autoriser COMPLETED et CANCELLED
        // pour que la page de l'événement s'affiche toujours même s'il est fini.
        status: { [Op.in]: ['PUBLISHED', 'COMPLETED', 'CANCELLED'] }
      },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement introuvable.' });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = {
  getPublicEvents,
  getEventById,
};
