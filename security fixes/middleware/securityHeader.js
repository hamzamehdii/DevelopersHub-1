const helmet = require('helmet');
const express = require('express');
const app = express();

// Apply all Helmet security headers
app.use(helmet());

// Individual header explanations for documentation
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],           // Only load resources from same origin
        scriptSrc: ["'self'"],            // No inline scripts - prevents XSS
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],            // Block Flash and plugins
        frameAncestors: ["'none'"],       // Prevents clickjacking
    },
}));

app.use(helmet.hsts({
    maxAge: 31536000,        // 1 year in seconds
    includeSubDomains: true, // Apply to all subdomains
    preload: true
}));

// Test route to show headers are applied
app.get('/security-check', (req, res) => {
    res.json({
        message: 'Security headers applied',
        headers_set: [
            'Content-Security-Policy',
            'X-Frame-Options',
            'X-Content-Type-Options',
            'Strict-Transport-Security',
            'X-XSS-Protection',
            'Referrer-Policy'
        ]
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('=== HELMET.JS SECURITY HEADERS DEMO ===');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Visit http://localhost:${PORT}/security-check`);
    console.log('\nOpen browser DevTools > Network tab > click the request');
    console.log('Look at Response Headers to see all security headers applied');
});

module.exports = app;