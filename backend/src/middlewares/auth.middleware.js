/**
 * Middleware d'authentification — Vérifie le token JWT
 * 
 * Ce middleware s'exécute AVANT le controller sur chaque route protégée.
 * 
 * Fonctionnement :
 * 1. Récupère le token dans le header "Authorization: Bearer <token>"
 * 2. Vérifie que le token est valide et non expiré
 * 3. Extrait les données de l'utilisateur (id, role) du token
 * 4. Attache ces données à req.user pour que le controller y accède
 * 
 * Si le token est absent ou invalide → erreur 401 (non authentifié)
 * 
 * Utilisation dans les routes :
 *   router.get('/profil', authMiddleware, controller.getProfil);
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès refusé. Token manquant.',
      });
    }

    // 2. Extraire le token (enlever "Bearer " du début)
    const token = authHeader.split(' ')[1];

    // 3. Vérifier et décoder le token
    // jwt.verify lance une erreur si le token est invalide ou expiré
    const decoded = jwt.verify(token, config.jwt.accessSecret);

    // 4. Vérifier que l'utilisateur existe toujours en base
    // (il a pu être supprimé ou désactivé depuis la création du token)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }, // Ne pas inclure le mot de passe
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé.',
      });
    }

    // 5. Attacher l'utilisateur à la requête
    // Tous les controllers suivants pourront faire req.user.id, req.user.role, etc.
    req.user = user;

    next(); // Passer au middleware/controller suivant
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token invalide.',
    });
  }
};

module.exports = authMiddleware;
