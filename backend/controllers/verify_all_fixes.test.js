/**
 * COMPREHENSIVE BUG FIX VERIFICATION TESTS
 *
 * Tests all bugs identified and fixed in the repository
 */

const assert = require('assert');

console.log('\n========================================');
console.log('BUG FIX VERIFICATION TEST SUITE');
console.log('========================================\n');

let passed = 0;
let failed = 0;

// Helper
function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        passed++;
    } catch (err) {
        console.error(`❌ ${name}: ${err.message}`);
        failed++;
    }
}

// ==================================================
// BUG #1: authController schema mismatch (ALREADY FIXED)
// ==================================================
test('BUG #1: authController uses correct schema fields', () => {
    const fs = require('fs');
    const path = require('path');
    const authPath = path.join(__dirname, 'authController.js');
    const content = fs.readFileSync(authPath, 'utf8');

    // Should use NombreUsuario, not Email
    assert.ok(content.includes('NombreUsuario'), 'Should use NombreUsuario');
    assert.ok(!content.includes("WHERE Email = @Email"), 'Should NOT use Email column');

    // Should use PasswordHash, not Password
    assert.ok(content.includes('PasswordHash'), 'Should use PasswordHash');

    // Should use RolID as INT
    assert.ok(content.includes('ROL_USER = 2'), 'Should define ROL_USER constant');
    assert.ok(content.includes('RolID'), 'Should use RolID');
});

// ==================================================
// BUG #2: getRequest not exported from db.js
// ==================================================
test('BUG #2: db.js exports getRequest function', () => {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, '../db.js');
    const content = fs.readFileSync(dbPath, 'utf8');

    // Should export getRequest
    assert.ok(
        content.includes('getRequest') && content.includes('module.exports'),
        'getRequest should be exported'
    );
    assert.ok(
        content.includes('{ connectDB, sql, getRequest }'),
        'Should export all three: connectDB, sql, getRequest'
    );
});

// ==================================================
// BUG #3: Unused useState import in App.jsx
// ==================================================
test('BUG #3: App.jsx has no unused useState import', () => {
    const fs = require('fs');
    const path = require('path');
    const appPath = path.join(__dirname, '../../frontend/src/App.jsx');
    const content = fs.readFileSync(appPath, 'utf8');

    // Should NOT have useState import
    assert.ok(
        !content.includes("import { useState } from 'react'"),
        'Should not have unused useState import'
    );
});

// ==================================================
// BUG #4: Login email input type
// ==================================================
test('BUG #4: Login uses type="email" for email input', () => {
    const fs = require('fs');
    const path = require('path');
    const loginPath = path.join(__dirname, '../../frontend/src/pages/Login.jsx');
    const content = fs.readFileSync(loginPath, 'utf8');

    // Should use type="email" not type="text"
    assert.ok(
        content.includes('type="email"'),
        'Email input should have type="email"'
    );
});

// ==================================================
// BUG #5: Route order in citas.js
// ==================================================
test('BUG #5: citas.js routes in correct order (specific before parameterized)', () => {
    const fs = require('fs');
    const path = require('path');
    const citasPath = path.join(__dirname, '../../ClinicaDentalVacaDiez-Completo/ClinicaDentalVacaDiez/routes/citas.js');
    const content = fs.readFileSync(citasPath, 'utf8');

    const fechaRoutePos = content.indexOf("/fecha/:fecha");
    const idRoutePos = content.indexOf("router.get('/:id', citasController.getCitaById)");

    assert.ok(fechaRoutePos > 0, '/fecha/:fecha route should exist');
    assert.ok(idRoutePos > 0, '/:id route should exist');
    assert.ok(
        fechaRoutePos < idRoutePos,
        '/fecha/:fecha should come BEFORE /:id to prevent route conflict'
    );
});

// ==================================================
// BUG #6: dashboardController uses existing table
// ==================================================
test('BUG #6: dashboardController uses Medicamentos instead of Inventario', () => {
    const fs = require('fs');
    const path = require('path');
    const dashPath = path.join(__dirname, '../../ClinicaDentalVacaDiez-Completo/ClinicaDentalVacaDiez/controllers/dashboardController.js');
    const content = fs.readFileSync(dashPath, 'utf8');

    // Should use Medicamentos, not Inventario
    assert.ok(
        content.includes('FROM Medicamentos'),
        'Should query Medicamentos table'
    );
    assert.ok(
        !content.includes('FROM Inventario'),
        'Should NOT reference non-existent Inventario table'
    );
});

// ==================================================
// BUG #7: TipoSeguro migration exists
// ==================================================
test('BUG #7: Migration for TipoSeguro column exists', () => {
    const fs = require('fs');
    const path = require('path');
    const migrationPath = path.join(__dirname, '../../migrations/001_add_tiposeguro_and_descuento.sql');

    assert.ok(
        fs.existsSync(migrationPath),
        'Migration file should exist'
    );

    const content = fs.readFileSync(migrationPath, 'utf8');
    assert.ok(
        content.includes('ADD TipoSeguro'),
        'Migration should add TipoSeguro column'
    );
    assert.ok(
        content.includes('ADD Descuento'),
        'Migration should add Descuento column'
    );
});

// ==================================================
// BUG #8: Unified Users schema
// ==================================================
test('BUG #8: CreacionDeUsuarios.sql uses correct unified schema', () => {
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../../CreacionDeUsuarios.sql');
    const content = fs.readFileSync(schemaPath, 'utf8');

    // Should document the conflict
    assert.ok(
        content.includes('UNIFIED USERS TABLE SCHEMA'),
        'Should have unified schema header'
    );

    // Should use correct fields
    assert.ok(
        content.includes('NombreUsuario NVARCHAR'),
        'Should use NombreUsuario'
    );
    assert.ok(
        content.includes('PasswordHash NVARCHAR'),
        'Should use PasswordHash'
    );
    assert.ok(
        content.includes('RolID INT'),
        'Should use RolID as INT with FK'
    );

    // Should deprecate old schema
    assert.ok(
        content.includes('DEPRECATED'),
        'Should mark old schema as deprecated'
    );
});

// ==================================================
// SUMMARY
// ==================================================
console.log('\n========================================');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
    process.exit(1);
}
