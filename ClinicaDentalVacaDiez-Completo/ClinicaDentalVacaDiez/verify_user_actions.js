
const API_URL = 'http://localhost:3000/api';
const fs = require('fs');

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('test_user_result.log', msg + '\n');
};

async function runUserTests() {
    try {
        fs.writeFileSync('test_user_result.log', '');
        log('--- Starting User Actions Verification ---');

        // 1. Login as User
        log('1. Logging in as User (usuario)...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'usuario', password: 'user123' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
        const { token, user } = await loginRes.json();
        log(`   Login successful. Role: ${user.role}, PacienteID: ${user.pacienteId}`);

        // 2. Try to Create Patient (Should Fail)
        log('2. Trying to Create Patient (Should Fail)...');
        const patientData = {
            nombre: 'Test',
            apellido: 'UserCreate',
            fechaNacimiento: '1990-01-01',
            genero: 'M',
            telefono: '555555',
            correo: 'test.usercreate@example.com',
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

        if (createPatientRes.status === 403) {
            log('   Create Patient failed as expected (403 Forbidden).');
        } else {
            log(`   WARNING: Create Patient returned status ${createPatientRes.status}`);
        }

        // 3. Create Cita (Should Success)
        log('3. Creating Cita for self...');
        // Get odontologos
        const odontologosRes = await fetch(`${API_URL}/odontologos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const odontologos = await odontologosRes.json();
        const odontologoId = odontologos[0].OdontologoID;

        const citaData = {
            pacienteId: user.pacienteId,
            odontologoId: odontologoId,
            fecha: new Date().toISOString().split('T')[0],
            hora: '14:00',
            motivo: 'Test User Cita'
        };

        const createCitaRes = await fetch(`${API_URL}/citas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(citaData)
        });

        let citaId;
        if (!createCitaRes.ok) {
            const err = await createCitaRes.text();
            if (err.includes('ya tiene una cita')) {
                log('   Slot taken, trying 15:00...');
                citaData.hora = '15:00';
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
                citaId = retryData.citaId;
            } else {
                throw new Error(`Create Cita failed: ${err}`);
            }
        } else {
            const citaResData = await createCitaRes.json();
            citaId = citaResData.citaId;
        }
        log(`   Cita created with ID: ${citaId}`);

        // 4. Cancel Cita (Should Success)
        log('4. Cancelling Cita...');
        const deleteRes = await fetch(`${API_URL}/citas/${citaId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!deleteRes.ok) throw new Error(`Cancel Cita failed: ${await deleteRes.text()}`);
        log('   Cita cancelled successfully.');

        log('--- USER TESTS PASSED ---');

    } catch (error) {
        console.error('!!! TEST FAILED !!!');
        console.error(error);
        log('!!! TEST FAILED !!!');
        log(error.message);
    }
}

runUserTests();
