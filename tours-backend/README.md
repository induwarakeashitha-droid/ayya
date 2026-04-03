# 🌴 PearlHeritageTours.com — Backend API

Simple Node.js + PostgreSQL backend for the PearlHeritageTours.com tour website.

---

## Setup (3 steps)

**1. Install**
```bash
npm install
```

**2. Configure**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL password
```

**3. Create database & run**
```bash
# In psql:
CREATE DATABASE blooming_smiles;

# Then setup tables + seed data:
node db/setup.js

# Start server:
npm run dev
```

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/tours` | All tours |
| GET | `/api/tours?category=day_tour` | Filter by category |
| GET | `/api/tours?type=wildlife` | Filter by type |
| GET | `/api/tours/:slug` | Single tour |
| GET | `/api/blog` | All blog posts |
| GET | `/api/blog/:slug` | Single post |
| GET | `/api/accommodations` | All hotels |
| GET | `/api/accommodations?type=luxury` | Filter hotels |
| POST | `/api/enquiries` | Submit booking enquiry |
| GET | `/api/enquiries` | List all enquiries |
| PATCH | `/api/enquiries/:id` | Update enquiry status |
| POST | `/api/contact` | Submit contact message |
| GET | `/health` | Health check |

---

## POST /api/enquiries — Body

```json
{
  "name":         "Sarah Smith",
  "email":        "sarah@email.com",
  "whatsapp":     "+44 7700 000000",
  "nationality":  "British",
  "tour_name":    "Sigiriya & Dambulla Day Tour",
  "travel_date":  "2025-03-15",
  "adults":       2,
  "children":     0,
  "duration":     "Full Day",
  "budget":       "Mid-Range ($100–$200/day)",
  "vehicle":      "car",
  "guide_option": "guide",
  "notes":        "Vegetarian meals please"
}
```

---

## Database Tables

- **tours** — all 23 tours & itineraries
- **enquiries** — booking enquiries from contact form
- **blog_posts** — blog articles
- **accommodations** — hotel listings
- **contact_messages** — general contact form submissions

---

## Connect Frontend to API

In your HTML pages, replace static content with API calls:

```js
// Load tours from API
fetch('http://localhost:3000/api/tours?category=day_tour')
  .then(r => r.json())
  .then(data => console.log(data.data));

// Submit enquiry
fetch('http://localhost:3000/api/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ whatsapp: '+94771234567', tour_name: 'Yala Safari' })
});
```
