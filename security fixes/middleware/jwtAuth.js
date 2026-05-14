const jwt = require('jsonwebtoken');

// In production this comes from environment variables, never hardcoded
const JWT_SECRET = process.env.JWT_SECRET || 'internship-demo-secret-change-in-production';
const JWT_EXPIRES_IN = '1h'; // Token expires in 1 hour

// Generate a token after successful login
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role || 'user'
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256'
    });
}

// Middleware to verify token on protected routes
function verifyToken(req, res, next) {
    // Token should be in Authorization header: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired. Please login again.'
            });
        }
        return res.status(403).json({
            success: false,
            error: 'Invalid token.'
        });
    }
}

// Middleware to check admin role
function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            error: 'Access denied. Admin privileges required.'
        });
    }
}

module.exports = { generateToken, verifyToken, requireAdmin };