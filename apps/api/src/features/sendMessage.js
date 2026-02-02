const logger = require('../utils/logger');

/**
 * @swagger
 * /send_message:
 *   post:
 *     summary: Send a text message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: Phone number with country code (e.g., 5511999999999)
 *               chat_id:
 *                 type: string
 *                 description: Direct WhatsApp Chat ID (e.g., 5511999999999@c.us or group@g.us)
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 */
const sendMessage = async (req, res) => {
    const { phone_number, chat_id, message } = req.body;

    if (!phone_number && !chat_id) {
        return res.status(400).json({ success: false, error: 'Missing phone_number or chat_id' });
    }

    if (!message) {
        return res.status(400).json({ success: false, error: 'Missing message' });
    }

    try {
        await req.waClient.sendMessage(phone_number, chat_id, message);
        res.json({ success: true, message: `message sent` });
    } catch (error) {
        logger.error(`Failed to send message: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = sendMessage;
