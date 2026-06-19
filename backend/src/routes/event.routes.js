/**
 * Routes Publiques des Événements
 * 
 * Accessibles à TOUS (visiteurs connectés ou non).
 * Montées sur /api/events dans app.js
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// GET /api/events → Liste publique avec filtres
router.get('/', eventController.getPublicEvents);

// GET /api/events/:id → Détails d'un événement
router.get('/:id', eventController.getEventById);

module.exports = router;
