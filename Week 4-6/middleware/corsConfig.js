const cors = require('cors');
const { logger } = require('../config/logger');

// Whitelist of allowed origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://yourdomain.com' // production domain placeholder
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn('CORS_VIOLATION', {
                blockedOrigin: origin,
                timestamp: new Date().toISOString()
            });
            callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true,
    maxAge: 86400 // Cache preflight for 24 hours
};

// Strict CORS for API routes
const strictCors = cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: false
});

module.exports = { corsMiddleware: cors(corsOptions), strictCors };