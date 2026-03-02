const logger = require('../utils/logger');

/**
 * Middleware that validates the API Key and API Secret headers.
 * Both values must match the corresponding environment variables.
 *
 * Headers expected:
 *   x-api-key    – must equal process.env.API_KEY
 *   x-api-secret – must equal process.env.API_SECRET
 */
const authenticateToken = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const apiSecret = req.headers['x-api-secret'];

    if (!process.env.API_KEY || !process.env.API_SECRET) {
        logger.error('API_KEY or API_SECRET environment variables are not set');
        return res.status(500).json({ success: false, error: 'Server authentication is not configured' });
    }

    if (!apiKey || !apiSecret) {
        return res.status(401).json({ success: false, error: 'Missing x-api-key or x-api-secret headers' });
    }

    if (apiKey !== process.env.API_KEY || apiSecret !== process.env.API_SECRET) {
        logger.warn(`Unauthorized request from ${req.ip}`);
        return res.status(403).json({ success: false, error: 'Invalid API key or secret' });
    }

    next();
};

module.exports = authenticateToken;
