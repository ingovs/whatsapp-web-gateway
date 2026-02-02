const logger = require('../utils/logger');

/**
 * @swagger
 * /auth/qr_code:
 *   get:
 *     summary: Get current QR code and status
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Current QR code and status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 qr:
 *                   type: string
 */
const authQrCode = (req, res) => {
    res.json({
        status: req.waClient.status,
        qr: req.waClient.qrCode
    });
};

module.exports = authQrCode;
