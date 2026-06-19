/**
 * Middleware d'upload de fichiers (images)
 * 
 * Utilise la bibliothèque "multer" pour traiter les formulaires
 * de type "multipart/form-data" (nécessaire quand on envoie des fichiers).
 * 
 * Fonctionnement :
 * - Vérifie que le fichier est bien une image (jpeg, png, webp)
 * - Renomme le fichier avec un timestamp pour éviter les doublons
 * - Stocke le fichier dans le dossier configuré (uploads/)
 */

const multer = require('multer');
const path = require('path');
const config = require('../config/env');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Le dossier de destination (../uploads)
    cb(null, path.join(__dirname, '..', '..', config.uploadPath));
  },
  filename: (req, file, cb) => {
    // Renommer : event-16987654321.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accepter le fichier
  } else {
    cb(new Error('Format de fichier non supporté. Seuls JPG, PNG et WEBP sont acceptés.'), false);
  }
};

// Limite la taille de l'image à 20 Mo
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

module.exports = upload;
