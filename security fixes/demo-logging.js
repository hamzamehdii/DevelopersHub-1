const { logger, securityLogger } = require('./config/logger');

console.log('=== WINSTON SECURITY LOGGING DEMO ===\n');

logger.info('Application started');

// Simulate security events
securityLogger.loginAttempt('admin@juice-sh.op', '192.168.1.100', true);
securityLogger.loginAttempt('hacker@evil.com', '10.0.0.1', false);
securityLogger.xssAttempt('<script>alert("XSS")</script>', '10.0.0.1');
securityLogger.sqlInjectionAttempt("' OR 1=1--", '10.0.0.1');
securityLogger.suspiciousInput('<iframe src=evil.com>', 'search', '10.0.0.1');

logger.error('Multiple failed login attempts from same IP', {
    ip: '10.0.0.1',
    attempts: 5,
    action: 'IP flagged for review'
});

console.log('\nCheck the logs/ folder for security.log and error.log files');