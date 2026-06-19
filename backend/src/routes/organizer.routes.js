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

module.exports = router;
