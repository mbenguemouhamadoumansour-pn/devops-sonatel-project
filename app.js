const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur mon API DevOps',
        version: '1.0.0',
        author: 'Mansour MBENGUE'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = app;

