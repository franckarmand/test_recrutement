const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const prisma = require('../services/prisma');

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// GET /articles - Liste tous les articles
router.get('/', authMiddleware, async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
  }
});

// POST /articles - Créer un nouvel article
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Le titre et le contenu sont requis' });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(article);
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'article' });
  }
});

// DELETE /articles/:id - Supprimer un article
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Article supprimé avec succès' });
  } catch (err) {
    console.error('Error deleting article:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
  }
});

module.exports = router;
