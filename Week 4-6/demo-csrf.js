const express = require('express');
const cookieParser = require('cookie-parser');
const { csrfProtection, csrfErrorHandler } = require('./middleware/csrfProtection');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET route — provides CSRF token to legitimate users
app.get('/form', csrfProtection, (req, res) => {
    res.json({
        message: 'Here is your CSRF token for form submission',
        csrfToken: req.csrfToken(),
        instruction: 'Include this token in your POST request as _csrf field'
    });
});

// POST route — requires valid CSRF token
app.post('/transfer', csrfProtection, (req, res) => {
    res.json({
        success: true,
        message: 'Transfer completed — CSRF token was valid'
    });
});

// CSRF error handler must be last
app.use(csrfErrorHandler);

app.listen(3004, () => {
    console.log('=== CSRF PROTECTION DEMO ===');
    console.log('Server on http://localhost:3004');
    console.log('\nStep 1: GET /form — get your CSRF token');
    console.log('Step 2: POST /transfer WITH token — succeeds');
    console.log('Step 3: POST /transfer WITHOUT token — blocked\n');
});