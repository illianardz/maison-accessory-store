const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Maison Accessory Store API',
      version: '1.0.0',
      description: 'REST API for an e-commerce accessories store',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local dev server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Scan route files for annotations
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
