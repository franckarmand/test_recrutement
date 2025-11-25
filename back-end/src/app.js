const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const articlesRoutes = require('./routes/articles');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/items', itemsRoutes);
app.use('/articles', articlesRoutes);

module.exports = app;