/**
 * BUG FIX VERIFICATION TESTS - NEW FIXES SESSION
 *
 * verifica las correcciones realizadas en esta sesión de bug fixing
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('\n========================================');
console.log('NEW BUG FIXES VERIFICATION TEST SUITE');
console.log('========================================\n');

let passed = 0;
let failed = 0;

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

// base path para los archivos del proyecto completo
const BASE_PATH = path.join(__dirname, '../../ClinicaDentalVacaDiez-Completo/ClinicaDentalVacaDiez');

// ==================================================
// BUG #1: HoraCita type fix in updateCita
// ==================================================
test('BUG #1: citasController updateCita uses VarChar(5) for hora (not Time)', () => {
    const filePath = path.join(BASE_PATH, 'controllers/citasController.js');
    const content = fs.readFileSync(filePath, 'utf8');

    // should use sql.VarChar(5) not sql.Time
    assert.ok(
        content.includes("sql.VarChar(5), hora"),
        'updateCita should use sql.VarChar(5) for hora parameter'
    );
    assert.ok(
        !content.includes("sql.Time, hora"),
        'updateCita should NOT use sql.Time for hora parameter'
    );
});

// ==================================================
// BUG #2: pacientesController updatePaciente validation
// ==================================================
test('BUG #2: pacientesController updatePaciente validates existence before update', () => {
    const filePath = path.join(BASE_PATH, 'controllers/pacientesController.js');
    const content = fs.readFileSync(filePath, 'utf8');

    // should check if patient exists
    assert.ok(
        content.includes('SELECT PacienteID FROM Pacientes WHERE PacienteID = @id'),
        'updatePaciente should check if patient exists'
    );
    assert.ok(
        content.includes("Paciente no encontrado"),
        'updatePaciente should return 404 if patient not found'
    );
    assert.ok(
        content.includes("Nombre y apellido son requeridos"),
        'updatePaciente should validate required fields'
    );
});

// ==================================================
// BUG #3: odontologosController createOdontologo validation
// ==================================================
test('BUG #3: odontologosController createOdontologo validates required fields', () => {
    const filePath = path.join(BASE_PATH, 'controllers/odontologosController.js');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.ok(
        content.includes("Nombre y apellido son requeridos"),
        'createOdontologo should validate nombre and apellido'
    );
    assert.ok(
        content.includes("Especialidad es requerida"),
        'createOdontologo should validate especialidad'
    );
    assert.ok(
        content.includes("OUTPUT INSERTED.OdontologoID"),
        'createOdontologo should return the created ID'
    );
});

// ==================================================
// BUG #4: dashboardController getPatientStats validation
// ==================================================
test('BUG #4: dashboardController getPatientStats validates patient existence', () => {
    const filePath = path.join(BASE_PATH, 'controllers/dashboardController.js');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.ok(
        content.includes("ID de paciente inválido"),
        'getPatientStats should validate pacienteId is valid'
    );
    assert.ok(
        content.includes("Paciente no encontrado"),
        'getPatientStats should return 404 if patient not found'
    );
});

// ==================================================
// BUG #6: middleware/auth.js JWT_SECRET fallback
// ==================================================
test('BUG #6: auth middleware has JWT_SECRET fallback', () => {
    const filePath = path.join(BASE_PATH, 'middleware/auth.js');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.ok(
        content.includes("const JWT_SECRET = process.env.JWT_SECRET ||"),
        'auth.js should have JWT_SECRET fallback'
    );
    assert.ok(
        content.includes("WARNING: JWT_SECRET no está definido"),
        'auth.js should log warning when using fallback'
    );
});

// ==================================================
// BUG #7: citasController deleteCita req.user validation
// ==================================================
test('BUG #7: citasController deleteCita validates req.user exists', () => {
    const filePath = path.join(BASE_PATH, 'controllers/citasController.js');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.ok(
        content.includes("if (!user)"),
        'deleteCita should check if user exists'
    );
    assert.ok(
        content.includes("No autorizado - sesión no válida"),
        'deleteCita should return 401 if user is undefined'
    );
});

// ==================================================
// BUG #8: segurosController includes Descuento column
// ==================================================
test('BUG #8: segurosController getAllSeguros includes Descuento column', () => {
    const filePath = path.join(BASE_PATH, 'controllers/segurosController.js');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.ok(
        content.includes("SELECT SeguroID, Nombre, Descuento FROM Seguros"),
        'getAllSeguros should include Descuento column'
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
