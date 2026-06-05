const express = require('express');
const { corsMiddleware } = require('./middleware/corsConfig');
const { generalLimiter, loginLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { requireApiKey, requirePermission } = require('./middleware/apiKeyAuth');
const { applyAdvancedHeaders } = require('./middleware/advancedHeaders');
const { logger } = require('./config/logger');

const app = express();

// 1. Security Headers
applyAdvancedHeaders(app);

// 2. CORS
app.use(corsMiddleware);

// 3. Rate Limiting — all routes
app.use(generalLimiter);

// 4. Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Request logging
app.use((req, res, next) => {
    logger.info('REQUEST', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        origin: req.headers.origin || 'direct'
    });
    next();
});

// Public route
app.get('/', (req, res) => {
    res.json({
        app: 'Week 4-6 Secure Application',
        security: 'Enhanced',
        features: [
            'Rate Limiting',
            'CORS Protection',
            'API Key Auth',
            'CSP Headers',
            'HSTS',
            'Security Logging'
        ]
    });
});

// Login with rate limiting
app.post('/login', loginLimiter, (req, res) => {
    const { email, password } = req.body;
    logger.info('LOGIN_ATTEMPT', { email, ip: req.ip });
    res.json({ success: true, message: 'Login endpoint with rate limiting active' });
});

// Protected API — requires API key
app.get('/api/data', apiLimiter, requireApiKey, (req, res) => {
    res.json({
        success: true,
        data: 'Protected data accessed successfully',
        accessedBy: req.apiKeyData.owner
    });
});

// Admin API — requires API key + write permission
app.post('/api/admin', apiLimiter, requireApiKey, requirePermission('write'), (req, res) => {
    res.json({
        success: true,
        message: 'Admin action performed',
        by: req.apiKeyData.owner
    });
});

const PORT = 3003;
app.listen(PORT, () => {
    logger.info(`Week 4-6 app started on port ${PORT}`);
    console.log(`\nServer: http://localhost:${PORT}`);
    console.log('\nTest with API key:');
    console.log(`curl -H "X-API-Key: ak_demo_intern_2026_key1" http://localhost:${PORT}/api/data`);
});