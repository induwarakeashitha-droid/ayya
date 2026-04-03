const express = require('express');
const router  = express.Router();
const db      = require('../db/db');

// GET /api/tours — all tours (optional ?category=day_tour&type=wildlife)
router.get('/', async (req, res) => {
  try {
    const { category, type } = req.query;
    let sql    = 'SELECT * FROM tours WHERE is_active = TRUE';
    const vals = [];

    if (category) { vals.push(category); sql += ` AND category = $${vals.length}`; }
    if (type)     { vals.push(type);     sql += ` AND type = $${vals.length}`;     }

    sql += ' ORDER BY id';
    const { rows } = await db(sql, vals);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tours/:slug — single tour
router.get('/:slug', async (req, res) => {
  try {
    const { rows } = await db(
      'SELECT * FROM tours WHERE slug = $1 AND is_active = TRUE',
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
