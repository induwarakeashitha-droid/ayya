const express = require('express');
const router  = express.Router();
const db      = require('../db/db');

// GET /api/blog — all published posts
router.get('/', async (req, res) => {
  try {
    const { rows } = await db(
      `SELECT id, slug, title, excerpt, author, image_url, created_at
       FROM blog_posts WHERE published = TRUE ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:slug — single post
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await db(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = TRUE',
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
