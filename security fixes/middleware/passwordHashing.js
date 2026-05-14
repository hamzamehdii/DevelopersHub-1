const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12; // Higher = more secure but slower

// Hash a password before storing
async function hashPassword(plainTextPassword) {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Password hashing failed: ' + error.message);
    }
}

// Compare login password against stored hash
async function verifyPassword(plainTextPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Password verification failed: ' + error.message);
    }
}

// Middleware for registration - hashes password in request
async function hashPasswordMiddleware(req, res, next) {
    if (req.body.password) {
        try {
            req.body.password = await hashPassword(req.body.password);
            next();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        next();
    }
}

// Demonstration function showing the difference
async function demonstrateHashing() {
    const plainPassword = 'MyPassword123!';
    
    console.log('=== PASSWORD HASHING DEMONSTRATION ===');
    console.log('Plain text (INSECURE):', plainPassword);
    
    const hashed = await hashPassword(plainPassword);
    console.log('Bcrypt hashed (SECURE):', hashed);
    
    const isValid = await verifyPassword(plainPassword, hashed);
    console.log('Verification result:', isValid);
    
    // Show why MD5 is weak
    console.log('\n=== WHY MD5 IS INSECURE ===');
    console.log('MD5 of same password always produces same hash');
    console.log('Bcrypt includes random salt - different hash every time');
    
    const hash1 = await hashPassword(plainPassword);
    const hash2 = await hashPassword(plainPassword);
    console.log('Hash 1:', hash1);
    console.log('Hash 2:', hash2);
    console.log('Are they different?', hash1 !== hash2, '(this is good - it means salting works)');
}

module.exports = { hashPassword, verifyPassword, hashPasswordMiddleware, demonstrateHashing };