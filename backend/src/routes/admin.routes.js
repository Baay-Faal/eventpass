/**
 * Routes d'Administration
 * 
 * Accessibles uniquement aux utilisateurs avec le rôle ADMIN.
 * Montées sur /api/admin dans app.js
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// On applique le middleware d'authentification et de rôle à TOUTES les routes de ce fichier
router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

// ─── ROUTES ORGANISATEURS ──────────────────────────────────────────────
router.get('/organizers', adminController.getOrganizers);
router.post('/organizers', adminController.createOrganizer);
router.put('/organizers/:id', adminController.updateOrganizer);
router.patch('/organizers/:id/status', adminController.toggleOrganizerStatus);

// ─── ROUTES AGENTS ─────────────────────────────────────────────────────
router.get('/agents', adminController.getAgents);
router.post('/agents', adminController.createAgent);
router.patch('/agents/:id/status', adminController.toggleAgentStatus);

const categoryController = require('../controllers/category.controller');

// ─── ROUTES STATISTIQUES ───────────────────────────────────────────────
router.get('/stats', adminController.getGlobalStats);

// ─── ROUTES CATEGORIES ─────────────────────────────────────────────────
router.post('/categories', categoryController.createCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
