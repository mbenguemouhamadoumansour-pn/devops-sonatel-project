const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
