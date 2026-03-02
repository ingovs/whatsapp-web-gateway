const { Client, LocalAuth } = require('whatsapp-web.js');
const logger = require('./utils/logger');
const { getJid } = require('./utils/jid');


class WhatsAppClient {
    constructor(io) {
        this.io = io;
        this.status = 'INITIALIZING'; // INITIALIZING, QR_READY, READY, DISCONNECTED
        this.qrCode = null;


        // Build client options
        const clientOptions = {
            authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
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
        };

        this.client = new Client(clientOptions);

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

    // async requestPairingCode(number) {
    //     if (this.status === 'READY' || this.status === 'AUTHENTICATED') {
    //         throw new Error('Client is already authenticated');
    //     }
    //
    //     // Just wait briefly if still initializing to ensure the page is ready
    //     if (this.status === 'INITIALIZING') {
    //         logger.info('Waiting for client to finish initializing...');
    //         let retries = 10;
    //         while (this.status === 'INITIALIZING' && retries > 0) {
    //             await new Promise(resolve => setTimeout(resolve, 1000));
    //             retries--;
    //         }
    //         if (this.status === 'INITIALIZING') {
    //             throw new Error('Client initialization timeout. Please try again.');
    //         }
    //     }
    //
    //     logger.info(`Requesting pairing code for ${number}`);
    //     try {
    //         // Ensure onCodeReceivedEvent is exposed on the page.
    //         // whatsapp-web.js only registers it when pairWithPhoneNumber is set
    //         // in the constructor, but we skip that to allow QR code flow by default.
    //         const page = this.client.pupPage;
    //         if (page) {
    //             const hasHandler = await page.evaluate(() => typeof window.onCodeReceivedEvent === 'function');
    //             if (!hasHandler) {
    //                 await page.exposeFunction('onCodeReceivedEvent', (code) => {
    //                     this.client.emit('code', code);
    //                     return code;
    //                 });
    //                 logger.info('Exposed onCodeReceivedEvent on the page for pairing');
    //             }
    //         }
    //
    //         return await this.client.requestPairingCode(number);
    //     } catch (error) {
    //         logger.error(`Failed to request pairing code: %o`, error);
    //         throw new Error(`Failed to get pairing code: ${error.message || error}`);
    //     }
    // }

    async logout() {
        logger.info('Logging out and clearing session...');
        try {
            // Logout from WhatsApp (sends logout signal to server)
            await this.client.logout();
        } catch (err) {
            logger.warn(`client.logout() error (may already be disconnected): ${err.message}`);
        }

        try {
            // Destroy puppeteer browser
            await this.client.destroy();
        } catch (err) {
            logger.warn(`client.destroy() error: ${err.message}`);
        }

        this.status = 'DISCONNECTED';
        this.qrCode = null;
        this.io.emit('status', this.status);

        // Re-initialize so a fresh QR code appears
        logger.info('Re-initializing client after logout...');
        const { Client, LocalAuth } = require('whatsapp-web.js');
        this.client = new Client({
            authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
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
        this.status = 'INITIALIZING';
        this.io.emit('status', this.status);
        this.registerEvents();
        this.client.initialize();
    }
}

module.exports = WhatsAppClient;
