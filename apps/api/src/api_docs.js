const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'WhatsApp Gateway API',
            version: '1.0.0',
            description: 'API for sending WhatsApp messages and managing connection via whatsapp-web.js',
        },
        servers: [
            {
                url: 'http://whatsapp-web-gateway.com',
                description: 'Production server',
            },
            {
                url: `http://localhost:8080`,
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/features/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
    swaggerUi,
    swaggerDocs
};
