const express = require('express');
const { generalLimiter, loginLimiter } = require('./middleware/rateLimiter');
const { logger } = require('./config/logger');

const app = express();
app.use(express.json());

app.use(generalLimiter);

app.post('/login', loginLimiter, (req, res) => {
    // Simulate failed login
    logger.warn('FAILED_LOGIN', { ip: req.ip, email: req.body.email });
    res.status(401).json({ success: false, error: 'Invalid credentials' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Rate limiting active on this server' });
});

app.listen(3003, () => {
    console.log('Rate limit demo running on http://localhost:3003');
    console.log('\nTo test: send 6 POST requests to /login');
    console.log('The 6th request will be blocked with 429 status\n');
});