/**
 * Routes de Check-in
 * 
 * Accessibles uniquement aux utilisateurs avec le rôle AGENT.
 * Montées sur /api/checkin dans app.js
 */

const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Protection : seules les personnes connectées avec le rôle AGENT peuvent scanner
router.use(authMiddleware);
router.use(roleMiddleware('AGENT'));

// POST /api/checkin/scan → Scanner et valider un billet
router.post('/scan', checkinController.scanTicket);

module.exports = router;
