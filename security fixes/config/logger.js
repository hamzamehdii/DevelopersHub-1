const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        // Console output
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // File output - all logs
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/security.log')
        }),
        // Separate file for errors only
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error'
        })
    ]
});

// Security-specific logging functions
const securityLogger = {
    loginAttempt: (email, ip, success) => {
        logger.info('LOGIN_ATTEMPT', {
            email,
            ip,
            success,
            event: 'authentication'
        });
    },

    suspiciousInput: (input, field, ip) => {
        logger.warn('SUSPICIOUS_INPUT_DETECTED', {
            field,
            input: input.substring(0, 100), // Don't log full payload
            ip,
            event: 'security_alert'
        });
    },

    xssAttempt: (payload, ip) => {
        logger.error('XSS_ATTEMPT_BLOCKED', {
            payload: payload.substring(0, 100),
            ip,
            event: 'attack_blocked'
        });
    },

    sqlInjectionAttempt: (payload, ip) => {
        logger.error('SQL_INJECTION_ATTEMPT_BLOCKED', {
            payload: payload.substring(0, 100),
            ip,
            event: 'attack_blocked'
        });
    }
};

module.exports = { logger, securityLogger };