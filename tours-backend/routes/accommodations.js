const express = require('express');
const router  = express.Router();
const db      = require('../db/db');

// GET /api/accommodations — all (optional ?type=luxury&location=Yala)
router.get('/', async (req, res) => {
  try {
    const { type, location } = req.query;
    let sql    = 'SELECT * FROM accommodations WHERE is_active = TRUE';
    const vals = [];

    if (type)     { vals.push(`%${type}%`);     sql += ` AND type ILIKE $${vals.length}`;     }
    if (location) { vals.push(`%${location}%`); sql += ` AND location ILIKE $${vals.length}`; }

    sql += ' ORDER BY stars DESC, name';
    const { rows } = await db(sql, vals);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
