/**
 * Routes des Billets
 * 
 * Accessibles uniquement aux utilisateurs avec le rôle VISITOR.
 * Montées sur /api/tickets dans app.js
 */

const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Protection : seules les personnes connectées avec le rôle VISITOR peuvent acheter/voir leurs billets
router.use(authMiddleware);
router.use(roleMiddleware('VISITOR'));

// POST /api/tickets/purchase → Acheter un ou plusieurs billets
router.post('/purchase', ticketController.purchaseTickets);

// GET /api/tickets/my-tickets → Voir la liste de ses billets
router.get('/my-tickets', ticketController.getMyTickets);

// GET /api/tickets/:id → Voir les détails d'un billet précis
router.get('/:id', ticketController.getTicketById);

// PATCH /api/tickets/:id/cancel → Annuler un billet
router.patch('/:id/cancel', ticketController.cancelTicket);

module.exports = router;
