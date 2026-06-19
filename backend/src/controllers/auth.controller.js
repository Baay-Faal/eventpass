/**
 * Controller d'authentification
 * 
 * 4 actions :
 *   register → inscription d'un visiteur (seul rôle avec inscription libre)
 *   login    → connexion (tous les rôles)
 *   refresh  → renouveler l'access token avec le refresh token
 *   logout   → déconnexion (côté client, on supprime les tokens)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { User } = require('../models');
const config = require('../config/env');

/**
 * Génère un access token (courte durée : 15 min)
 * Contient l'id et le rôle de l'utilisateur
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
};

/**
 * Génère un refresh token (longue durée : 7 jours)
 * Sert uniquement à obtenir un nouveau access token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

// ─── REGISTER ──────────────────────────────────────────────────────────
// POST /api/auth/register
// Inscription libre — uniquement pour les visiteurs

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Vérifier que tous les champs sont remplis
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires (firstName, lastName, email, password).',
      });
    }

    // 2. Vérifier que l'email n'est pas déjà utilisé
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé.',
      });
    }

    // 3. Hasher le mot de passe
    // bcrypt.hash(password, 10) → le "10" est le nombre de rounds de salage
    // Le résultat est irréversible : on ne peut pas retrouver le mot de passe original
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Créer l'utilisateur en base
    // Le rôle est automatiquement VISITOR (défini dans le modèle)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'VISITOR',
    });

    // 5. Générer les tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 6. Répondre sans le mot de passe
    res.status(201).json({
      success: true,
      message: 'Inscription réussie.',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription.',
    });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// Connexion — tous les rôles

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier les champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont obligatoires.',
      });
    }

    // 2. Chercher l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
        // On ne dit pas "email introuvable" pour ne pas révéler
        // quels emails sont inscrits (sécurité)
      });
    }

    // 3. Vérifier que le compte est actif
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez l\'administrateur.',
      });
    }

    // 4. Comparer le mot de passe avec le hash en base
    // bcrypt.compare fait le hashage du mot de passe entré
    // et le compare avec le hash stocké
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // 5. Générer les tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 6. Répondre
    res.json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion.',
    });
  }
};

// ─── REFRESH TOKEN ─────────────────────────────────────────────────────
// POST /api/auth/refresh
// Renouvelle l'access token quand il a expiré

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token manquant.',
      });
    }

    // 1. Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);

    // 2. Vérifier que l'utilisateur existe toujours
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable ou désactivé.',
      });
    }

    // 3. Générer un nouveau access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      success: true,
      message: 'Token renouvelé.',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token invalide ou expiré.',
    });
  }
};

// ─── LOGOUT ────────────────────────────────────────────────────────────
// POST /api/auth/logout
// Déconnexion — côté serveur, on ne fait rien de spécial avec JWT
// C'est le frontend qui supprime les tokens de sa mémoire

const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Déconnexion réussie.',
  });
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// Demande de réinitialisation de mot de passe

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'L\'email est requis.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      // Pour des raisons de sécurité, on renvoie un succès même si l'email n'existe pas
      // pour éviter de lister les emails existants.
      return res.json({ success: true, message: 'Si l\'email existe, un lien de réinitialisation vous a été envoyé.' });
    }

    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Le hasher pour le stocker en base (sécurité supplémentaire)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Mettre à jour l'utilisateur (valable 1 heure)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Normalement, on envoie un email ici.
    // Comme on n'a pas de SMTP, on simule l'envoi en affichant le lien dans la console
    // et en le renvoyant dans la réponse (pour pouvoir tester).
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    console.log(`[SIMULATION EMAIL] URL de réinitialisation pour ${email}: ${resetUrl}`);

    res.json({
      success: true,
      message: 'Si l\'email existe, un lien de réinitialisation vous a été envoyé.',
      // RETIRER resetUrl EN PRODUCTION !! C'est uniquement pour tester.
      resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined
    });

  } catch (error) {
    console.error('Erreur forgotPassword:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────────────────────
// POST /api/auth/reset-password
// Réinitialisation effective avec le token

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token et nouveau mot de passe requis.' });
    }

    // Hasher le token reçu pour le comparer avec celui en base
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() } // Doit être dans le futur
      }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalide ou expiré.' });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ success: true, message: 'Mot de passe réinitialisé avec succès.' });

  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
