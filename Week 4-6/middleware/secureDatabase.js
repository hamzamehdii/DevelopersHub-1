// This file demonstrates the fix for SQL Injection
// using parameterized queries / prepared statements

// ============================================
// VULNERABLE CODE (what Juice Shop does)
// ============================================
function vulnerableLogin(email, password) {
    // NEVER DO THIS — string concatenation in SQL
    const query = `SELECT * FROM Users WHERE email='${email}' 
                   AND password='${password}'`;
    
    console.log('VULNERABLE query:', query);
    console.log('Attack payload "  OR 1=1-- " produces:');
    const attackQuery = `SELECT * FROM Users WHERE email='' OR 1=1--' 
                         AND password='anything'`;
    console.log(attackQuery);
    console.log('Result: Returns ALL users — authentication bypassed!\n');
    
    return query;
}

// ============================================
// SECURE CODE — Parameterized Queries
// ============================================
function secureLogin(email, password) {
    // Parameters are passed separately — never concatenated
    const query = 'SELECT * FROM Users WHERE email=? AND password=?';
    const params = [email, password];
    
    console.log('SECURE query template:', query);
    console.log('Parameters (handled separately):', params);
    console.log('Attack payload "  OR 1=1--" as parameter produces:');
    console.log('Searches for literal string "  OR 1=1--" as email');
    console.log('Result: No match found — authentication NOT bypassed\n');
    
    return { query, params };
}

// ============================================
// DEMONSTRATION
// ============================================
console.log('=== SQL INJECTION: VULNERABLE vs SECURE ===\n');

console.log('--- Normal login ---');
vulnerableLogin('admin@juice-sh.op', 'password123');
secureLogin('admin@juice-sh.op', 'password123');

console.log('--- Attack attempt ---');
vulnerableLogin("' OR 1=1--", 'anything');
secureLogin("' OR 1=1--", 'anything');

console.log('=== ADDITIONAL PROTECTIONS ===');
console.log('1. Input validation: reject emails with SQL characters');
console.log('2. Least privilege: DB user should only have SELECT on Users table');
console.log('3. Error handling: never expose DB errors to the user');
console.log('4. ORM usage: Sequelize/Mongoose automatically parameterize queries');

module.exports = { vulnerableLogin, secureLogin };