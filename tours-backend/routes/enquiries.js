const express = require('express');
const router  = express.Router();
const db      = require('../db/db');

// POST /api/enquiries — submit booking enquiry from contact form
router.post('/', async (req, res) => {
  try {
    const {
      name, email, whatsapp, nationality,
      tour_name, travel_date, adults, children,
      duration, budget, vehicle, guide_option, notes
    } = req.body;

    if (!whatsapp) {
      return res.status(400).json({ success: false, message: 'WhatsApp number is required' });
    }

    const { rows } = await db(
      `INSERT INTO enquiries
        (name, email, whatsapp, nationality, tour_name, travel_date,
         adults, children, duration, budget, vehicle, guide_option, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id, created_at`,
      [
        name, email, whatsapp, nationality, tour_name,
        travel_date || null,
        adults  || 2,
        children|| 0,
        duration, budget, vehicle, guide_option, notes
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Enquiry received! We will contact you within 24 hours.',
      id: rows[0].id
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/enquiries — list all (simple admin view)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql    = 'SELECT * FROM enquiries';
    const vals = [];
    if (status) { vals.push(status); sql += ` WHERE status = $1`; }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await db(sql, vals);
    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/enquiries/:id — update status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'booked', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }
    const { rows } = await db(
      'UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
