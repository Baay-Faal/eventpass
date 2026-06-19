/**
 * Middleware de rôle — Vérifie que l'utilisateur a le bon rôle
 * 
 * Ce middleware s'utilise APRÈS authMiddleware (qui met req.user).
 * Il vérifie que le rôle de l'utilisateur est dans la liste autorisée.
 * 
 * Utilisation :
 *   router.post('/create', authMiddleware, roleMiddleware('ADMIN'), controller.create);
 *   router.get('/dashboard', authMiddleware, roleMiddleware('ORGANIZER'), controller.dashboard);
 *   router.post('/scan', authMiddleware, roleMiddleware('AGENT'), controller.scan);
 * 
 * On peut aussi autoriser plusieurs rôles :
 *   roleMiddleware('ADMIN', 'ORGANIZER')  → admin OU organisateur
 * 
 * Si le rôle ne correspond pas → erreur 403 (interdit)
 */

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user est défini par authMiddleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise.',
      });
    }

    // Vérifier si le rôle de l'utilisateur est dans la liste autorisée
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.',
      });
    }

    next(); // Rôle autorisé → continuer
  };
};

module.exports = roleMiddleware;
