const { demonstrateHashing } = require('./middleware/passwordHashing');

demonstrateHashing().then(() => {
    console.log('\nDemo complete.');
}).catch(console.error);