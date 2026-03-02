const logger = require('../utils/logger');

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Force logout and clear session
 *     tags: [Authentication]
 *     description: Logs out the WhatsApp client and removes cached session data, forcing a fresh authentication on next start.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
const logout = async (req, res) => {
    try {
        await req.waClient.logout();
        res.json({ success: true, message: 'Logged out and session cleared. Client is reinitializing.' });
    } catch (error) {
        logger.error(`Failed to logout: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = logout;
