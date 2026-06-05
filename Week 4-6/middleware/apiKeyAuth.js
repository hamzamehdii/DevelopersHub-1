const crypto = require('crypto');
const { logger } = require('../config/logger');

// In production these live in a database
// For demo purposes, stored in memory
const validApiKeys = new Map([
    ['ak_demo_intern_2026_key1', { owner: 'intern-app', permissions: ['read'] }],
    ['ak_demo_admin_2026_key2', { owner: 'admin-app', permissions: ['read', 'write', 'delete'] }]
]);

// Generate a new API key
function generateApiKey() {
    return 'ak_' + crypto.randomBytes(24).toString('hex');
}

// Middleware to validate API key
function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        logger.warn('API_KEY_MISSING', {
            ip: req.ip,
            path: req.path,
            timestamp: new Date().toISOString()
        });
        return res.status(401).json({
            success: false,
            error: 'API key required. Include X-API-Key header.'
        });
    }

    const keyData = validApiKeys.get(apiKey);

    if (!keyData) {
        logger.error('INVALID_API_KEY_ATTEMPT', {
            ip: req.ip,
            attemptedKey: apiKey.substring(0, 10) + '...', // Don't log full key
            timestamp: new Date().toISOString()
        });
        return res.status(403).json({
            success: false,
            error: 'Invalid API key.'
        });
    }

    // Attach key info to request
    req.apiKeyData = keyData;
    logger.info('API_ACCESS_GRANTED', {
        owner: keyData.owner,
        path: req.path
    });
    next();
}

// Check specific permission
function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.apiKeyData.permissions.includes(permission)) {
            return res.status(403).json({
                success: false,
                error: `Permission denied. '${permission}' access required.`
            });
        }
        next();
    };
}

module.exports = { requireApiKey, requirePermission, generateApiKey, validApiKeys };