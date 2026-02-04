require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const db = require('./db');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Simple login to get a token (for demo). Replace with proper user store in production.
app.post('/login', (req, res) => {
    const { username, password } = req.body || {};
    const expectedUser = process.env.DEMO_USER || 'admin';
    const expectedPass = process.env.DEMO_PASS || 'password';

    if (username === expectedUser && password === expectedPass) {
        const secret = process.env.JWT_SECRET || 'change_this_secret';
        const token = jwt.sign({ username }, secret, { expiresIn: '12h' });
        return res.json({ token });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

// Protected endpoints
app.get('/plants', auth(true), async(req, res) => {
    try {
        const plants = await db.getPlants();
        res.json({ plants });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/plants', auth(true), async(req, res) => {
    try {
        const { name } = req.body || {};
        if (!name) return res.status(400).json({ error: 'Missing plant name' });
        const plant = await db.addPlant(name);
        res.status(201).json(plant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/plants/:id', auth(true), async(req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name } = req.body || {};
        if (!name) return res.status(400).json({ error: 'Missing plant name' });
        const result = await db.updatePlant(id, name);
        if (result.changes === 0) return res.status(404).json({ error: 'Plant not found' });
        res.json({ id, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/plants/:id', auth(true), async(req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await db.deletePlant(id);
        if (result.changes === 0) return res.status(404).json({ error: 'Plant not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.json({ ok: true, message: 'Garden API running' }));

app.listen(PORT, () => {
    console.log(`Garden API listening on port ${PORT}`);
});