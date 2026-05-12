const test = require('node:test');
const assert = require('node:assert/strict');

process.env.MENTORSHIP_API_URL = 'http://127.0.0.1:65535';

const app = require('../app');

function startServer() {
    return new Promise((resolve, reject) => {
        const server = app.listen(0, () => resolve(server));
        server.on('error', reject);
    });
}

test('página de login', async () => {
    const server = await startServer();

    try {
        const { port } = server.address();
        const response = await fetch(`http://127.0.0.1:${port}/login`);

        assert.equal(response.status, 200);
        const body = await response.text();
        assert.match(body, /Login/i);
    } finally {
        server.close();
    }
});

test('bad gateway se o serviço de mentoria não estiver disponível', async () => {
    const server = await startServer();

    try {
        const { port } = server.address();
        const response = await fetch(`http://127.0.0.1:${port}/api/mentorships/student/1`);

        assert.equal(response.status, 502);
        const body = await response.json();
        assert.equal(body.message, 'Microserviço indisponível.');
    } finally {
        server.close();
    }
});