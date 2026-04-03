require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.use('/api/tours',          require('./routes/tours'));
app.use('/api/enquiries',      require('./routes/enquiries'));
app.use('/api/blog',           require('./routes/blog'));
app.use('/api/accommodations', require('./routes/accommodations'));
app.use('/api/contact',        require('./routes/contact'));

// ── Health check ──────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PearlHeritageTours.com API' });
});

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌴 PearlHeritageTours.com API running on http://localhost:${PORT}\n`);
  console.log('  GET  /api/tours');
  console.log('  GET  /api/tours/:slug');
  console.log('  GET  /api/blog');
  console.log('  GET  /api/accommodations');
  console.log('  POST /api/enquiries');
  console.log('  POST /api/contact\n');
});
