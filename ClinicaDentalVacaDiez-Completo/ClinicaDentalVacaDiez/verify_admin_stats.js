
const API_URL = 'http://localhost:3000/api';

async function checkAdminStats() {
    try {
        console.log('Logging in as Admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${await loginRes.text()}`);
        const { token } = await loginRes.json();
        console.log('Login successful.');

        console.log('Fetching Admin Stats...');
        const statsRes = await fetch(`${API_URL}/dashboard/admin`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!statsRes.ok) throw new Error(`Get Stats failed: ${await statsRes.text()}`);
        const stats = await statsRes.json();
        console.log('Admin Stats:', stats);

        if (stats.totalFacturado !== undefined) {
            console.log(`SUCCESS: totalFacturado is present: ${stats.totalFacturado}`);
        } else {
            console.error('FAILURE: totalFacturado is MISSING');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

checkAdminStats();
