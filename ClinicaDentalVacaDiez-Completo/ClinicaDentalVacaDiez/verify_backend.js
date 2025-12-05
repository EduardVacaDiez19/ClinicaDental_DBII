
const API_URL = 'http://localhost:3000/api';
const fs = require('fs');

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('test_result.log', msg + '\n');
};

async function runTests() {
    try {
        fs.writeFileSync('test_result.log', ''); // Clear file
        log('--- Starting Backend Verification ---');

        // 1. Login as Admin
        log('1. Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
        const { token } = await loginRes.json();
        log('   Login successful.');

        // 2. Create Patient
        log('2. Creating Patient...');
        const patientData = {
            nombre: 'Test',
            apellido: 'Backend',
            fechaNacimiento: '1990-01-01',
            genero: 'M',
            telefono: '555555',
            correo: 'test.backend@example.com',
            direccion: 'Test Address',
            tipoSeguro: 'Ninguno'
        };

        const createPatientRes = await fetch(`${API_URL}/pacientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(patientData)
        });

        if (!createPatientRes.ok) throw new Error(`Create Patient failed: ${await createPatientRes.text()}`);
        const { pacienteId } = await createPatientRes.json();
        log(`   Patient created with ID: ${pacienteId}`);

        // 3. Create Cita
        log('3. Creating Cita...');
        // Get an odontologo first
        const odontologosRes = await fetch(`${API_URL}/odontologos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const odontologos = await odontologosRes.json();
        const odontologoId = odontologos[0].OdontologoID;

        // Get a tratamiento
        const tratamientosRes = await fetch(`${API_URL}/tratamientos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tratamientos = await tratamientosRes.json();
        const tratamientoId = tratamientos[0].TratamientoID;

        const citaData = {
            pacienteId: pacienteId,
            odontologoId: odontologoId,
            fecha: new Date().toISOString().split('T')[0], // Today
            hora: '10:00',
            motivo: 'Test Backend',
            tratamientoId: tratamientoId
        };

        const createCitaRes = await fetch(`${API_URL}/citas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(citaData)
        });

        if (!createCitaRes.ok) {
            const err = await createCitaRes.text();
            // If duplicate, try another time
            if (err.includes('ya tiene una cita')) {
                log('   Slot taken, trying 11:00...');
                citaData.hora = '11:00';
                const retryRes = await fetch(`${API_URL}/citas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(citaData)
                });
                if (!retryRes.ok) throw new Error(`Create Cita retry failed: ${await retryRes.text()}`);
                const retryData = await retryRes.json();
                var citaId = retryData.citaId;
            } else {
                throw new Error(`Create Cita failed: ${err}`);
            }
        } else {
            const citaResData = await createCitaRes.json();
            var citaId = citaResData.citaId;
        }
        log(`   Cita created with ID: ${citaId}`);

        // 4. Generate Factura (Pay)
        log('4. Generating Factura...');
        const facturaRes = await fetch(`${API_URL}/citas/${citaId}/facturar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ metodoPago: 'Efectivo' })
        });

        if (!facturaRes.ok) throw new Error(`Generate Factura failed: ${await facturaRes.text()}`);
        log('   Factura generated successfully.');

        // 5. Cancel Cita (Should fail if invoiced? Or maybe we allow it but it's complex. Let's try deleting another one or just delete this one and see)
        // Actually, let's create another cita to delete, to be clean.
        log('5. Creating another Cita to Cancel...');
        citaData.hora = '12:00';
        const createCita2Res = await fetch(`${API_URL}/citas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(citaData)
        });
        const cita2Data = await createCita2Res.json();
        const citaId2 = cita2Data.citaId;
        log(`   Cita 2 created with ID: ${citaId2}`);

        log('6. Cancelling Cita 2...');
        const deleteRes = await fetch(`${API_URL}/citas/${citaId2}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!deleteRes.ok) throw new Error(`Cancel Cita failed: ${await deleteRes.text()}`);
        log('   Cita cancelled successfully.');

        // Cleanup Patient
        log('7. Cleaning up Patient...');
        await fetch(`${API_URL}/pacientes/${pacienteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        log('   Patient deleted.');

        log('--- ALL TESTS PASSED ---');

    } catch (error) {
        console.error('!!! TEST FAILED !!!');
        console.error(error);
        log('!!! TEST FAILED !!!');
        log(error.message);
        if (error.stack) log(error.stack);
    }
}

runTests();
