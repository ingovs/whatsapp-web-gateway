const logger = require('../utils/logger');

/**
 * @swagger
 * /auth/pairing_code:
 *   get:
 *     summary: Request a pairing code
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: phone_number
 *         schema:
 *           type: string
 *         required: true
 *         description: Phone number to pair
 *     responses:
 *       200:
 *         description: Pairing code returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                    type: boolean
 *                 code:
 *                    type: string
 *       500:
 *         description: Server error
 */
const authPairingCode = async (req, res) => {
    // User snippet uses GET, so we take from query
    const { phone_number } = req.query;

    if (!phone_number) {
        return res.status(400).json({ success: false, error: 'Missing phone_number' });
    }

    try {
        const code = await req.waClient.requestPairingCode(phone_number);
        res.json({ success: true, code });
    } catch (error) {
        logger.error(`Failed to request pairing code for ${phone_number}: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = authPairingCode;
