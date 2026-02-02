require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');

const WhatsAppClient = require('./whatsappClient');
const logger = require('./utils/logger');

// Features (endpoints)
const clientStatus = require('./features/status');
const authQrCode = require('./features/authQrCode');
const authPairingCode = require('./features/authPairingCode');
const login = require('./features/login');
const sendMessage = require('./features/sendMessage');
const sendMedia = require('./features/sendMedia');

// Middleware
const authenticateToken = require('./middlewares/auth');

const allowedOrigins = [
    'http://localhost:3000',               // Dev frontend (Vite default)
    'http://localhost:8080',               // Web container (nginx)
    'http://whatsapp-web-gateway.com'      // Production frontend
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// App configuration
app.use(cors({ origin: allowedOrigins }));
app.use(bodyParser.json({ limit: '70mb' }));
app.use(bodyParser.urlencoded({ limit: '70mb', extended: true }));
app.use(express.json());

// Initialize WhatsApp Client
const waClient = new WhatsAppClient(io);
waClient.initialize();

// Middleware to inject waClient into request
app.use((req, res, next) => {
    req.waClient = waClient;
    next();
});

// Socket.io events
io.on('connection', (socket) => {
    logger.info('New client connected');
    socket.emit('status', waClient.status);
    if (waClient.status === 'QR_READY' && waClient.qrCode) {
        socket.emit('qr', waClient.qrCode);
    }
});

// Import Swagger docs
const { swaggerUi, swaggerDocs } = require('./api_docs');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define routes
const router = express.Router();

// GET
router.get('/status', clientStatus);
router.get('/auth/qr_code', authQrCode); // QR Code - Public for initial setup
router.get('/auth/pairing_code', authPairingCode); // Pairing Code - Public for initial setup
router.get('/login', login);

// POST
router.post('/send_message', authenticateToken, sendMessage);
router.post('/send_media', authenticateToken, sendMedia);

// Use the router in the app
app.use('/', router);

const PORT = process.env.PORT;

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
