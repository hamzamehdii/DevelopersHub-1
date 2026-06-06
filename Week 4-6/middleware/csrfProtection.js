const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const { logger } = require('../config/logger');

// CSRF protection using cookies
const csrfProtection = csrf({
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    }
});

// Error handler for CSRF failures
function csrfErrorHandler(err, req, res, next) {
    if (err.code === 'EBADCSRFTOKEN') {
        logger.error('CSRF_ATTACK_DETECTED', {
            ip: req.ip,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        });
        return res.status(403).json({
            success: false,
            error: 'Invalid or missing CSRF token. Request blocked.'
        });
    }
    next(err);
}

module.exports = { csrfProtection, csrfErrorHandler };