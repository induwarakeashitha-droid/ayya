const express = require('express');
const router  = express.Router();
const db      = require('../db/db');

// POST /api/contact — simple contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, whatsapp, subject, message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    await db(
      `INSERT INTO contact_messages (name, email, whatsapp, subject, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, whatsapp, subject, message]
    );

    res.status(201).json({ success: true, message: 'Message sent! We will reply within 24 hours.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
