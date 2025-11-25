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
			return res.status(400).send('Tous les champs sont requis.');
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) return res.status(409).send('Cet utilisateur existe déjà.');

		const hashed = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { firstName, lastName, email, password: hashed },
			select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
		});

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET || 'change-me',
			{ expiresIn: '7d' }
		);

		// La réponse au succès peut rester en JSON
		return res.status(201).json({ user, token });

	} catch (err) {
		console.error("Erreur lors de l'inscription", err);
		return res.status(500).send('Erreur interne du serveur.');
	}
});

// POST /auth/login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			return res.status(400).send('Veuillez fournir votre email et mot de passe.');
		}

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(401).send('Email ou mot de passe incorrect.');

		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(401).send('Email ou mot de passe incorrect.');

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET || 'change-me',
			{ expiresIn: '7d' }
		);

		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName
			}
		});

	} catch (err) {
		console.error('Erreur lors de la connexion', err);
		return res.status(500).send('Erreur interne du serveur.');
	}
});

module.exports = router;
