
const API_URL = 'http://localhost:3000/api';

async function debugLogin() {
    try {
        console.log('Attempting login...');
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'usuario', password: 'user123' })
        });

        console.log(`Response Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`Response Body: "${text}"`);

        try {
            const json = JSON.parse(text);
            console.log('Parsed JSON:', json);
        } catch (e) {
            console.error('Failed to parse JSON:', e.message);
        }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

debugLogin();
