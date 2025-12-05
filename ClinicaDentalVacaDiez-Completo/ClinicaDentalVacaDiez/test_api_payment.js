

async function testApi() {
    try {
        // Login
        const loginRes = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'usuario', password: 'password123' }) // Assuming password123 works
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Logged in, token obtained.');

        // Get Detalle Pago for Cita 4
        const detailRes = await fetch('http://localhost:3000/api/citas/4/detalle-pago', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const detailData = await detailRes.json();
        console.log('Status:', detailRes.status);
        console.log('Data:', detailData);

    } catch (error) {
        console.error(error);
    }
}

testApi();
