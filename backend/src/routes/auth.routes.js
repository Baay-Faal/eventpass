/**
 * Routes d'authentification
 * 
 * Ces routes sont montées sur /api/auth dans app.js
 * Donc POST /register → POST /api/auth/register
 * 
 * Endpoints :
 *   POST /api/auth/register  → Inscription visiteur (public)
 *   POST /api/auth/login     → Connexion (public)
 *   POST /api/auth/refresh   → Renouveler le token (public — envoie le refresh token)
 *   POST /api/auth/logout    → Déconnexion (authentifié)
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Routes publiques (pas besoin de token)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Route protégée (nécessite un token valide)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
