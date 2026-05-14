const express = require('express');
const helmet = require('helmet');
const { logger, securityLogger } = require('./config/logger');
const { validateRegistration, sanitizeInputs, validateSearch } = require('./middleware/inputValidation');
const { hashPasswordMiddleware } = require('./middleware/passwordHashing');
const { generateToken, verifyToken } = require('./middleware/jwtAuth');

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Sanitize all inputs
app.use(sanitizeInputs);

// 4. Log all requests
app.use((req, res, next) => {
    logger.info('REQUEST', {
        method: req.method,
        path: req.path,
        ip: req.ip
    });
    next();
});

// Registration route - with validation and password hashing
app.post('/register', validateRegistration, hashPasswordMiddleware, (req, res) => {
    const { email, password } = req.body;
    logger.info('New user registered', { email });
    res.json({
        success: true,
        message: 'User registered securely',
        note: 'Password has been bcrypt hashed with 12 salt rounds'
    });
});

// Login route - with JWT
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Simulate successful login (in real app, verify against DB)
    const mockUser = { id: 1, email, role: 'user' };
    const token = generateToken(mockUser);

    securityLogger.loginAttempt(email, req.ip, true);

    res.json({
        success: true,
        token,
        message: 'Login successful - JWT token issued'
    });
});

// Protected route - requires valid JWT
app.get('/profile', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: 'Protected route accessed successfully',
        user: req.user
    });
});

// Search route - with XSS protection
app.get('/search', validateSearch, (req, res) => {
    res.json({
        success: true,
        query: req.query.q,
        message: 'Search input validated and sanitized'
    });
});

const PORT = 3002;
app.listen(PORT, () => {
    logger.info(`Secure demo server started on port ${PORT}`);
    console.log(`\n=== SECURE APPLICATION RUNNING ===`);
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`\nTest endpoints:`);
    console.log(`POST http://localhost:${PORT}/register`);
    console.log(`POST http://localhost:${PORT}/login`);
    console.log(`GET  http://localhost:${PORT}/profile`);
    console.log(`GET  http://localhost:${PORT}/search?q=test`);
});