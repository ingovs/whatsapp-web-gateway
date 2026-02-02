const logger = require('../utils/logger');

/**
 * @swagger
 * /send_media:
 *   post:
 *     summary: Send a media message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - media
 *             properties:
 *               phone_number:
 *                 type: string
 *               chat_id:
 *                 type: string
 *               media:
 *                 type: string
 *                 description: Base64 encoded media data
 *               caption:
 *                 type: string
 *               mimetype:
 *                 type: string
 *                 example: image/png
 *               filename:
 *                 type: string
 *     responses:
 *       200:
 *         description: Media sent successfully
 *       500:
 *         description: Server error
 */
const sendMedia = async (req, res) => {
    const { phone_number, chat_id, media, caption, mimetype = "image/png", filename = null } = req.body;

    if (!phone_number && !chat_id) {
        return res.status(400).json({ success: false, error: 'Missing phone_number or chat_id' });
    }

    if (!media) {
        return res.status(400).json({ success: false, error: 'Missing media' });
    }

    try {
        await req.waClient.sendMediaMessage(phone_number, chat_id, { mimetype, data: media, filename }, caption);
        res.json({ success: true, message: `media sent; mimetype: ${mimetype}` });
    } catch (error) {
        logger.error(`Failed to send media message: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = sendMedia;
