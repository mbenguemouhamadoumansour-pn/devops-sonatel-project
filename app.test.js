const request = require('supertest');
const app = require('./app');

describe('API Tests', () => {

    test('GET / returns welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Bienvenue sur mon API DevOps');
    });

    test('GET /health returns OK', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('OK');
    });

});

