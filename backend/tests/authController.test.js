/**
 * Unit tests for authController - verifying schema-compatible field names
 *
 * These tests prove that the controller uses the correct database schema:
 * - NombreUsuario (not Email)
 * - PasswordHash (not Password)
 * - RolID (INT, not Rol as string)
 */

const assert = require('assert');

// Mock SQL module to capture query parameters
const mockQueries = [];
const mockInputs = [];

const mockRequest = () => {
    const inputs = [];
    const req = {
        input: (name, type, value) => {
            inputs.push({ name, type: type?.name || 'Unknown', value });
            mockInputs.push({ name, type: type?.name || 'Unknown', value });
            return req;
        },
        query: async (queryString) => {
            mockQueries.push({ query: queryString, inputs: [...inputs] });
            // Simulate no user found for register check
            if (queryString.includes('SELECT') && queryString.includes('NombreUsuario')) {
                return { recordset: [] };
            }
            // Simulate successful insert
            if (queryString.includes('INSERT')) {
                return { rowsAffected: [1] };
            }
            return { recordset: [] };
        }
    };
    return req;
};

const mockPool = {
    request: mockRequest
};

// Mock mssql module
const mockSql = {
    connect: async () => mockPool,
    NVarChar: { name: 'NVarChar' },
    Int: { name: 'Int' }
};

// Override require for mssql
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
    if (id === 'mssql') {
        return mockSql;
    }
    return originalRequire.apply(this, arguments);
};

// Clear cache and re-require controller
delete require.cache[require.resolve('../controllers/authController')];
const { register, login } = require('../controllers/authController');

// Mock response object
const createMockRes = () => {
    const res = {
        statusCode: 200,
        data: null,
        status: function (code) {
            this.statusCode = code;
            return this;
        },
        json: function (data) {
            this.data = data;
            return this;
        },
        send: function (data) {
            this.data = data;
            return this;
        }
    };
    return res;
};

// Reset mocks before each test
function resetMocks() {
    mockQueries.length = 0;
    mockInputs.length = 0;
}

/**
 * TEST 1: Register uses NombreUsuario field (not Email)
 *
 * BEFORE FIX: query used "WHERE Email = @Email" - would fail with SQL error
 * AFTER FIX: query uses "WHERE NombreUsuario = @NombreUsuario"
 */
async function testRegisterUsesNombreUsuario() {
    resetMocks();

    const req = {
        body: {
            email: 'test@example.com',
            password: 'password123',
            nombre: 'Test',
            apellido: 'User',
            telefono: '555-1234'
        }
    };
    const res = createMockRes();

    await register(req, res);

    // Verify query uses NombreUsuario, NOT Email
    const selectQuery = mockQueries.find(q => q.query.includes('SELECT'));
    assert.ok(selectQuery, 'SELECT query should exist');
    assert.ok(
        selectQuery.query.includes('NombreUsuario'),
        `Query should use NombreUsuario field. Got: ${selectQuery.query}`
    );
    assert.ok(
        !selectQuery.query.includes('Email'),
        `Query should NOT use Email field. Got: ${selectQuery.query}`
    );

    // Verify input parameter name
    const nombreUsuarioInput = selectQuery.inputs.find(i => i.name === 'NombreUsuario');
    assert.ok(nombreUsuarioInput, 'Should use @NombreUsuario parameter');
    assert.strictEqual(nombreUsuarioInput.value, 'test@example.com');

    console.log('✅ TEST 1 PASSED: Register uses NombreUsuario field correctly');
}

/**
 * TEST 2: Register uses PasswordHash field (not Password)
 *
 * BEFORE FIX: INSERT used "Password" column - would fail with SQL error
 * AFTER FIX: INSERT uses "PasswordHash" column
 */
async function testRegisterUsesPasswordHash() {
    resetMocks();

    const req = {
        body: {
            email: 'newuser@example.com',
            password: 'securepass123'
        }
    };
    const res = createMockRes();

    await register(req, res);

    // Find INSERT query
    const insertQuery = mockQueries.find(q => q.query.includes('INSERT'));
    assert.ok(insertQuery, 'INSERT query should exist');
    assert.ok(
        insertQuery.query.includes('PasswordHash'),
        `INSERT should use PasswordHash field. Got: ${insertQuery.query}`
    );
    assert.ok(
        !insertQuery.query.includes(', Password,') && !insertQuery.query.includes('(Password,'),
        `INSERT should NOT use Password field. Got: ${insertQuery.query}`
    );

    // Verify PasswordHash parameter exists and is hashed
    const passwordHashInput = insertQuery.inputs.find(i => i.name === 'PasswordHash');
    assert.ok(passwordHashInput, 'Should have @PasswordHash parameter');
    assert.ok(
        passwordHashInput.value.startsWith('$2'),
        'PasswordHash should be bcrypt hashed (starts with $2)'
    );

    console.log('✅ TEST 2 PASSED: Register uses PasswordHash field correctly');
}

/**
 * TEST 3: Register uses RolID as INT (not Rol as string)
 *
 * BEFORE FIX: INSERT used "Rol" column with 'User' string - would fail
 * AFTER FIX: INSERT uses "RolID" column with INT value (2 for User)
 */
async function testRegisterUsesRolID() {
    resetMocks();

    const req = {
        body: {
            email: 'roletest@example.com',
            password: 'pass123'
        }
    };
    const res = createMockRes();

    await register(req, res);

    const insertQuery = mockQueries.find(q => q.query.includes('INSERT'));
    assert.ok(insertQuery, 'INSERT query should exist');

    // Verify uses RolID, not Rol
    assert.ok(
        insertQuery.query.includes('RolID'),
        `INSERT should use RolID field. Got: ${insertQuery.query}`
    );

    // Verify RolID parameter is INT type with value 2 (ROL_USER)
    const rolInput = insertQuery.inputs.find(i => i.name === 'RolID');
    assert.ok(rolInput, 'Should have @RolID parameter');
    assert.strictEqual(rolInput.type, 'Int', 'RolID should be Int type');
    assert.strictEqual(rolInput.value, 2, 'RolID should be 2 (ROL_USER)');

    console.log('✅ TEST 3 PASSED: Register uses RolID as INT correctly');
}

/**
 * TEST 4: Login uses NombreUsuario field (not Email)
 */
async function testLoginUsesNombreUsuario() {
    resetMocks();

    const req = {
        body: {
            email: 'login@example.com',
            password: 'password123'
        }
    };
    const res = createMockRes();

    await login(req, res);

    const selectQuery = mockQueries.find(q => q.query.includes('SELECT'));
    assert.ok(selectQuery, 'SELECT query should exist');
    assert.ok(
        selectQuery.query.includes('NombreUsuario'),
        `Login query should use NombreUsuario. Got: ${selectQuery.query}`
    );

    console.log('✅ TEST 4 PASSED: Login uses NombreUsuario field correctly');
}

/**
 * TEST 5: Login query references PasswordHash (not Password)
 */
async function testLoginUsesPasswordHash() {
    resetMocks();

    const req = {
        body: {
            email: 'hash@example.com',
            password: 'pass'
        }
    };
    const res = createMockRes();

    await login(req, res);

    const selectQuery = mockQueries.find(q => q.query.includes('SELECT'));
    assert.ok(selectQuery, 'SELECT query should exist');
    assert.ok(
        selectQuery.query.includes('PasswordHash'),
        `Login query should select PasswordHash. Got: ${selectQuery.query}`
    );

    console.log('✅ TEST 5 PASSED: Login selects PasswordHash field correctly');
}

/**
 * TEST 6: Register validates required fields
 */
async function testRegisterValidation() {
    resetMocks();

    // Test missing email
    const req1 = { body: { password: 'test' } };
    const res1 = createMockRes();
    await register(req1, res1);
    assert.strictEqual(res1.statusCode, 400, 'Should return 400 for missing email');

    // Test missing password
    const req2 = { body: { email: 'test@test.com' } };
    const res2 = createMockRes();
    await register(req2, res2);
    assert.strictEqual(res2.statusCode, 400, 'Should return 400 for missing password');

    console.log('✅ TEST 6 PASSED: Register validates required fields');
}

// Run all tests
async function runTests() {
    console.log('\n========================================');
    console.log('AUTHCONTROLLER SCHEMA FIX TESTS');
    console.log('========================================\n');

    let passed = 0;
    let failed = 0;

    const tests = [
        testRegisterUsesNombreUsuario,
        testRegisterUsesPasswordHash,
        testRegisterUsesRolID,
        testLoginUsesNombreUsuario,
        testLoginUsesPasswordHash,
        testRegisterValidation
    ];

    for (const test of tests) {
        try {
            await test();
            passed++;
        } catch (err) {
            console.error(`❌ ${test.name} FAILED:`, err.message);
            failed++;
        }
    }

    console.log('\n========================================');
    console.log(`RESULTS: ${passed} passed, ${failed} failed`);
    console.log('========================================\n');

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test suite error:', err);
    process.exit(1);
});
