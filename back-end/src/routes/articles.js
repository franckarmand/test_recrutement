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
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
  }
});

// GET /articles/:id - Récupérer un article spécifique
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.json(article);
  } catch (err) {
    console.error('Error fetching article:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'article' });
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
        userId: req.userId,
      },
    });

    res.status(201).json(article);
  } catch (err) {
    console.error('Error creating article:', err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'article' });
  }
});

// PUT /articles/:id - Modifier un article
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Le titre et le contenu sont requis' });
    }

    // Vérifier que l'article appartient à l'utilisateur
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingArticle) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (existingArticle.userId !== req.userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cet article' });
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });

    res.json(article);
  } catch (err) {
    console.error('Error updating article:', err);
    res.status(500).json({ message: 'Erreur lors de la modification de l\'article' });
  }
});

// DELETE /articles/:id - Supprimer un article
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'article appartient à l'utilisateur
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingArticle) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (existingArticle.userId !== req.userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cet article' });
    }

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
