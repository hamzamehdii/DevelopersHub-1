const { generateToken, verifyToken } = require('./middleware/jwtAuth');

console.log('=== JWT AUTHENTICATION DEMONSTRATION ===\n');

// Simulate a logged in user
const mockUser = {
    id: 1,
    email: 'admin@juice-sh.op',
    role: 'admin'
};

// Generate token
const token = generateToken(mockUser);
console.log('Generated JWT Token:');
console.log(token);
console.log('\nToken Structure (3 parts separated by dots):');
console.log('Header.Payload.Signature\n');

// Decode and show payload (not verifying, just showing structure)
const parts = token.split('.');
const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
console.log('Decoded Payload:');
console.log(JSON.stringify(payload, null, 2));

console.log('\n=== SECURITY BENEFITS ===');
console.log('1. Token expires in 1 hour - limits damage if stolen');
console.log('2. Signed with secret - cannot be tampered with');
console.log('3. Contains user role - enables authorization checks');
console.log('4. No session storage needed on server - stateless');