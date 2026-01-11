const axios = require('axios');

const API_URL = 'http://localhost:4000/api';

async function getOrCreateUser(name, email, password) {
    try {
        // Try Login
        const login = await axios.post(`${API_URL}/auth/login`, { email, password });
        console.log(`Logged in ${name}`);
        return login.data.accessToken;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Try Signup
            try {
                const signup = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
                console.log(`Signed up ${name}`);
                return signup.data.accessToken;
            } catch (signupError) {
                console.error(`Signup failed for ${name}:`, signupError.response?.data || signupError.message);
                throw signupError;
            }
        }
        console.error(`Login failed for ${name}:`, error.response?.data || error.message);
        throw error;
    }
}

async function runVerification() {
    try {
        const timestamp = Date.now();
        const user1Email = `leader_${timestamp}@test.com`;
        const user2Email = `writer_${timestamp}@test.com`;
        const password = 'password123';

        // 1. Get Users
        console.log('Setting up users...');
        const token1 = await getOrCreateUser('Leader', user1Email, password);
        const token2 = await getOrCreateUser('Writer', user2Email, password);

        // 2. Create Room (Leader)
        console.log('Creating Room...');
        const room = await axios.post(
            `${API_URL}/story-rooms`,
            {
                title: 'The Mystery of the Code',
                basePlot: 'A developer finds a bug that talks back.',
                characters: [{ name: 'Buggy', description: 'The sentient bug' }]
            },
            { headers: { Authorization: `Bearer ${token1}` } }
        );
        const roomId = room.data.id;
        console.log('Room created:', roomId);

        // 3. Join Room (Writer)
        console.log('Joining Room...');
        await axios.post(
            `${API_URL}/story-rooms/${roomId}/join`,
            {},
            { headers: { Authorization: `Bearer ${token2}` } }
        );
        console.log('Writer joined.');

        // 4. Start Room (Leader)
        console.log('Starting Room...');
        await axios.post(
            `${API_URL}/story-rooms/${roomId}/start`,
            {},
            { headers: { Authorization: `Bearer ${token1}` } }
        );
        console.log('Room started.');

        // 5. Submit Turn 1 (Leader)
        console.log('Submitting Turn 1 (Leader)...');
        try {
            await axios.post(
                `${API_URL}/story-rooms/${roomId}/turn`,
                { content: 'It was a dark and stormy compile time.' },
                { headers: { Authorization: `Bearer ${token1}` } }
            );
            console.log('Turn 1 submitted.');
        } catch (e) {
            console.log('Turn 1 failed (might be writer turn?):', e.response?.data);
            throw e;
        }

        // 6. Submit Turn 2 (Writer)
        console.log('Submitting Turn 2 (Writer)...');
        await axios.post(
            `${API_URL}/story-rooms/${roomId}/turn`,
            { content: 'Suddenly, a console.log appeared out of nowhere.' },
            { headers: { Authorization: `Bearer ${token2}` } }
        );
        console.log('Turn 2 submitted.');

        // 7. Fetch Room Details
        console.log('Fetching Room Details...');
        const roomDetails = await axios.get(`${API_URL}/story-rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token1}` }
        });

        console.log('Verification Successful!');
        console.log('Turns:', roomDetails.data.turns.length);
        console.log('Turns Content:', roomDetails.data.turns.map(t => t.content));
        console.log('Current Turn Index:', roomDetails.data.currentTurnIndex);

    } catch (error) {
        console.error('Verification Failed:', error.response?.data || error.message);
    }
}

runVerification();
