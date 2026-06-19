/**
 * Point d'entrée de l'application Express
 * 
 * Ce fichier fait 3 choses :
 * 1. Configure Express avec les middlewares globaux
 * 2. Monte les routes (chaque fichier de routes = un groupe d'endpoints)
 * 3. Démarre le serveur sur le port configuré
 * 
 * Middlewares globaux — s'exécutent sur CHAQUE requête :
 *   express.json()  → parse le body JSON des requêtes POST/PUT
 *   cors()          → autorise les requêtes du frontend (port différent)
 *   morgan()        → affiche chaque requête dans la console
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/env');
const { sequelize } = require('./models');

const app = express();

// ─── Middlewares globaux ───────────────────────────────────────────────

// Parse le JSON dans le body des requêtes POST, PUT, PATCH
app.use(express.json());

// Parse les données URL-encoded (formulaires HTML classiques)
app.use(express.urlencoded({ extended: true }));

// Autorise les requêtes cross-origin (le frontend tourne sur un port différent)
app.use(cors());

// Log chaque requête HTTP dans la console
// Format "dev" affiche : méthode, URL, statut, durée
// Ex: GET /api/events 200 12ms
app.use(morgan('dev'));

// Servir les fichiers uploadés (images d'événements)
app.use('/uploads', express.static(path.join(__dirname, '..', config.uploadPath)));

// ─── Routes ────────────────────────────────────────────────────────────

// Route de santé — vérifie que le serveur fonctionne
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EventPass API is running',
    timestamp: new Date().toISOString(),
  });
});

// Les routes métier seront ajoutées ici étape par étape :
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/organizer', require('./routes/organizer.routes'));
// app.use('/api/tickets', require('./routes/ticket.routes'));
// app.use('/api/checkin', require('./routes/checkin.routes'));

// ─── Gestion des erreurs ───────────────────────────────────────────────

// 404 — Route non trouvée
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} non trouvée`,
  });
});

// Gestionnaire d'erreurs global
// Quand un controller fait next(error), Express appelle ce middleware
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: config.nodeEnv === 'development' ? err.message : 'Erreur interne du serveur',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
});

// ─── Démarrage du serveur ──────────────────────────────────────────────
// On connecte d'abord Sequelize à MySQL, puis on crée les tables,
// et enfin on démarre le serveur Express.

const startServer = async () => {
  try {
    // 1. Tester la connexion à MySQL
    await sequelize.authenticate();
    console.log('✅ Connexion à MySQL réussie');

    // 2. Synchroniser les modèles avec la base de données
    // alter: true → modifie les tables existantes si le modèle a changé
    // ⚠️ En production, on utiliserait des migrations à la place
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');

    // 3. Démarrer le serveur Express
    app.listen(config.port, () => {
      console.log(`\n🎫 EventPass API`);
      console.log(`   Environnement : ${config.nodeEnv}`);
      console.log(`   Port          : ${config.port}`);
      console.log(`   URL           : http://localhost:${config.port}`);
      console.log(`   Health check  : http://localhost:${config.port}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Impossible de démarrer le serveur :', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
