const { generateApiKey, validApiKeys } = require('./middleware/apiKeyAuth');

console.log('=== API KEY AUTHENTICATION DEMO ===\n');

console.log('Existing valid API keys:');
validApiKeys.forEach((data, key) => {
    console.log(`Key: ${key}`);
    console.log(`Owner: ${data.owner}`);
    console.log(`Permissions: ${data.permissions.join(', ')}\n`);
});

console.log('Generating new API key:');
const newKey = generateApiKey();
console.log(`New key: ${newKey}`);
console.log('\nKey format: ak_[24 random bytes in hex]');
console.log('Each key is cryptographically random — impossible to guess');