const request = require('supertest');
const app = require('./app');

describe('API Tests', () => {
    test('GET / returns welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });

    test('GET /health returns OK', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });
});
