
const API_URL = 'http://localhost:3000/api';

async function checkPacientesAccess() {
    try {
        // 1. Login as User
        console.log('Logging in as User...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'usuario', password: 'user123' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
        const { token } = await loginRes.json();
        console.log('Login successful.');

        // 2. Get Pacientes
        console.log('Fetching Pacientes...');
        const res = await fetch(`${API_URL}/pacientes`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error(`Failed to get patients: ${res.status} ${res.statusText}`);
            console.error(await res.text());
        } else {
            const patients = await res.json();
            console.log(`Successfully fetched ${patients.length} patients.`);
            console.log('First patient:', patients[0]);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkPacientesAccess();
