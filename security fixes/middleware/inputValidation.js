const validator = require('validator');

// Middleware to validate and sanitize user registration input
function validateRegistration(req, res, next) {
    const { email, password, username } = req.body;
    const errors = [];

    // Check email
    if (!email || !validator.isEmail(email)) {
        errors.push('Invalid email address');
    }

    // Check password strength
    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        errors.push('Password must contain uppercase, lowercase, number and symbol');
    }

    // Sanitize username - strip any HTML/script tags (prevents XSS)
    if (username) {
        const sanitized = validator.escape(username);
        if (sanitized !== username) {
            errors.push('Username contains invalid characters');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    next();
}

// Middleware to sanitize all incoming text inputs
function sanitizeInputs(req, res, next) {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                // Remove HTML tags and encode special characters
                req.body[key] = validator.escape(req.body[key].trim());
            }
        }
    }
    next();
}

// Validate search input specifically
function validateSearch(req, res, next) {
    if (req.query.q) {
        // Strip script tags and SQL special chars from search
        const dangerous = /<script|javascript:|on\w+=/gi;
        if (dangerous.test(req.query.q)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid search input detected'
            });
        }
        req.query.q = validator.stripLow(req.query.q);
    }
    next();
}

module.exports = { validateRegistration, sanitizeInputs, validateSearch };