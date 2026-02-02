const { Client, LocalAuth } = require('whatsapp-web.js');
const logger = require('./utils/logger');
const { getJid } = require('./utils/jid');


class WhatsAppClient {
    constructor(io) {
        this.io = io;
        this.status = 'INITIALIZING'; // INITIALIZING, QR_READY, READY, DISCONNECTED
        this.qrCode = null;

        // whatsapp-web.js configuration
        this.client = new Client({
            authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
            pairWithPhoneNumber: {
                phoneNumber: process.env.WA_PHONE_NUMBER,
                showNotification: true,
            },
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                ]
            }
        });

        this.registerEvents();
    }

    registerEvents() {
        this.client.on('qr', (qr) => {
            logger.info('New QR Code received');
            this.status = 'QR_READY';
            this.qrCode = qr;
            this.io.emit('qr', qr);
            this.io.emit('status', this.status);
            // qrcode.generate(qr, { small: true }); // For terminal debug
        });

        this.client.on('ready', () => {
            logger.info('WhatsApp Client is ready!');
            this.status = 'READY';
            this.io.emit('status', this.status);
        });

        this.client.on('authenticated', () => {
            logger.info('Authenticated');
            this.status = 'AUTHENTICATED';
            this.io.emit('status', this.status);
        });

        this.client.on('auth_failure', (msg) => {
            logger.error('Authentication failure: %o', msg);
            this.status = 'DISCONNECTED';
            this.io.emit('status', this.status);
        });

        this.client.on('disconnected', (reason) => {
            logger.info('Client was disconnected: %o', reason);
            this.status = 'DISCONNECTED';
            this.io.emit('status', this.status);
        });
    }

    initialize() {
        this.client.initialize();
    }

    async sendMessage(phone_number, chat_id, content, options = {}) {
        if (this.status !== 'READY' && this.status !== 'AUTHENTICATED') {
            throw new Error('Client is not ready');
        }

        const jid = getJid(phone_number, chat_id);
        return await this.client.sendMessage(jid, content, options);
    }

    async sendMediaMessage(phone_number, chat_id, mediaContent, caption) {
        // mediaContent expectation: { mimetype: 'image/png', data: 'base64string', filename: 'image.png' }
        const { MessageMedia } = require('whatsapp-web.js');
        const media = new MessageMedia(mediaContent.mimetype, mediaContent.data, mediaContent.filename);

        return await this.sendMessage(phone_number, chat_id, media, { caption });
    }

    async requestPairingCode(number) {
        if (this.status === 'READY' || this.status === 'AUTHENTICATED') {
            throw new Error('Client is already authenticated');
        }
        // Pairing code requires purely numeric string, no @c.us
        // If number has @c.us or other chars, strip them
        const cleanNumber = number.replace(/\D/g, '');

        logger.info(`Requesting pairing code for ${cleanNumber}`);
        return await this.client.requestPairingCode(cleanNumber);
    }
}

module.exports = WhatsAppClient;
