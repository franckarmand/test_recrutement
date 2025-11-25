const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma');

// POST /auth/register
router.post('/register', async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body || {};
		if (!firstName || !lastName || !email || !password) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) return res.status(409).json({ error: 'User already exists' });

		const hashed = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { firstName, lastName, email, password: hashed },
			select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
		});

		// also return a JWT so the client can auto-login after registration
		const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'change-me', { expiresIn: '7d' });

		return res.status(201).json({ user, token });
	} catch (err) {
		console.error('Register error', err);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

// POST /auth/login
router.post('/', async (req, res) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });

		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

		const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'change-me', { expiresIn: '7d' });

		return res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
	} catch (err) {
		console.error('Login error', err);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;
