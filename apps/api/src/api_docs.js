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
                url: `http://localhost:8080`,
                description: 'Local server',
            },
            {
                url: 'http://whatsapp-web-gateway.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'API Key for authentication',
                },
                ApiSecretAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-secret',
                    description: 'API Secret for authentication',
                },
            },
        },
    },
    apis: ['./src/features/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = {
    swaggerUi,
    swaggerDocs
};
