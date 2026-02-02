/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get client status
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Current status of the WhatsApp client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: READY
 */
const status = (req, res) => {
    res.json({ status: req.waClient.status });
};

module.exports = status;
