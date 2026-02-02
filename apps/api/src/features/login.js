const logger = require('../utils/logger');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 */
const login = (req, res) => {
    const { username, password } = req.body;

    // Placeholder logic
    if (username === 'admin' && password === 'admin') {
        res.json({ success: true, token: 'dummy-token' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
};

module.exports = login;
