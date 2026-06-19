/**
 * Routes Organisateur
 * 
 * Accessibles uniquement aux utilisateurs avec le rôle ORGANIZER.
 * Montées sur /api/organizer dans app.js
 */

const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizer.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

// Protection : seules les personnes connectées avec le rôle ORGANIZER
router.use(authMiddleware);
router.use(roleMiddleware('ORGANIZER'));

// GET /api/organizer/dashboard → Voir les statistiques
router.get('/dashboard', organizerController.getDashboardStats);

// GET /api/organizer/events → Liste ses événements
router.get('/events', organizerController.getMyEvents);

// POST /api/organizer/events → Créer un événement
// "upload.single('image')" indique que l'on attend un fichier dans le champ "image" du formulaire
router.post('/events', upload.single('image'), organizerController.createEvent);

// PUT /api/organizer/events/:id → Modifier un événement (doit être DRAFT)
router.put('/events/:id', upload.single('image'), organizerController.updateEvent);

// PATCH /api/organizer/events/:id/publish → Publier un événement
router.patch('/events/:id/publish', organizerController.publishEvent);

// PATCH /api/organizer/events/:id/cancel → Annuler un événement
router.patch('/events/:id/cancel', organizerController.cancelEvent);

/**
 * @swagger
 * /api/organizer/events/{id}/tickets:
 *   get:
 *     summary: Récupérer tous les billets d'un événement
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des billets
 */
router.get('/events/:id/tickets', organizerController.getEventTickets);

/**
 * @swagger
 * /api/organizer/tickets/{id}/approve:
 *   patch:
 *     summary: Approuver un billet en attente
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet approuvé
 */
router.patch('/tickets/:id/approve', organizerController.approveTicket);

/**
 * @swagger
 * /api/organizer/tickets/{id}/reject:
 *   patch:
 *     summary: Refuser un billet en attente
 *     tags: [Organizer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billet refusé
 */
router.patch('/tickets/:id/reject', organizerController.rejectTicket);

module.exports = router;
