/**
 * Configuration Swagger (Documentation de l'API)
 * 
 * Ce fichier définit les informations générales de l'API
 * et indique à swagger-jsdoc où trouver les commentaires
 * de documentation dans notre code.
 */

const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPass API',
      version: '1.0.0',
      description: 'API de billetterie en ligne sécurisée avec QR codes dynamiques.',
      contact: {
        name: 'Baay-Faal Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Serveur de Développement',
      },
    ],
    // Configuration de l'authentification (pour que le bouton "Authorize" apparaisse dans l'UI)
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Collez votre access token ici',
        },
      },
    },
    // Appliquer l'auth par défaut (peut être surchargé par route)
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Où chercher la documentation ? Dans tous les fichiers routes
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
