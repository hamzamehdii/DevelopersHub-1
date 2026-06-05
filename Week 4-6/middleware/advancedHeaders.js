const helmet = require('helmet');

function applyAdvancedHeaders(app) {

    // Content Security Policy — prevents XSS and injection
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                // Allow specific trusted CDNs only
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],          // Block Flash/plugins completely
            mediaSrc: ["'none'"],
            frameSrc: ["'none'"],           // Prevent embedding in iframes
            frameAncestors: ["'none'"],     // Prevent clickjacking
            formAction: ["'self'"],         // Forms only submit to same origin
            upgradeInsecureRequests: [],    // Auto-upgrade HTTP to HTTPS
        },
        reportOnly: false // Enforce, don't just report
    }));

    // HTTP Strict Transport Security — forces HTTPS
    app.use(helmet.hsts({
        maxAge: 31536000,           // 1 year
        includeSubDomains: true,    // Apply to all subdomains
        preload: true               // Submit to browser preload lists
    }));

    // Additional headers
    app.use(helmet.noSniff());              // Prevent MIME sniffing
    app.use(helmet.frameguard({ action: 'deny' })); // Clickjacking protection
    app.use(helmet.xssFilter());           // XSS filter
    app.use(helmet.referrerPolicy({
        policy: 'strict-origin-when-cross-origin'
    }));
    app.use(helmet.permittedCrossDomainPolicies());

    console.log('[SECURITY] Advanced headers applied:');
    console.log('  ✓ Content-Security-Policy');
    console.log('  ✓ Strict-Transport-Security (HSTS)');
    console.log('  ✓ X-Content-Type-Options');
    console.log('  ✓ X-Frame-Options');
    console.log('  ✓ X-XSS-Protection');
    console.log('  ✓ Referrer-Policy');
}

module.exports = { applyAdvancedHeaders };