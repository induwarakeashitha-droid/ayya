// Run with: node db/setup.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'blooming_smiles',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function setup() {
  const client = await pool.connect();
  console.log('Connected to PostgreSQL...');

  try {
    // ── CREATE TABLES ─────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id          SERIAL PRIMARY KEY,
        slug        VARCHAR(100) UNIQUE NOT NULL,
        name        VARCHAR(200) NOT NULL,
        category    VARCHAR(50),          -- 'day_tour' | 'itinerary'
        type        VARCHAR(100),         -- 'heritage', 'wildlife', etc.
        duration    VARCHAR(100),
        price_from  DECIMAL(10,2),
        currency    VARCHAR(5) DEFAULT 'USD',
        difficulty  VARCHAR(50),
        group_type  VARCHAR(50) DEFAULT 'Private',
        description TEXT,
        highlights  TEXT[],
        image_url   VARCHAR(500),
        is_active   BOOLEAN DEFAULT TRUE,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS enquiries (
        id           SERIAL PRIMARY KEY,
        name         VARCHAR(200),
        email        VARCHAR(200),
        whatsapp     VARCHAR(50)  NOT NULL,
        nationality  VARCHAR(100),
        tour_name    VARCHAR(200),
        travel_date  DATE,
        adults       INT DEFAULT 2,
        children     INT DEFAULT 0,
        duration     VARCHAR(100),
        budget       VARCHAR(100),
        vehicle      VARCHAR(50),
        guide_option VARCHAR(50),
        notes        TEXT,
        status       VARCHAR(30) DEFAULT 'new',  -- 'new' | 'contacted' | 'booked' | 'cancelled'
        created_at   TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id          SERIAL PRIMARY KEY,
        slug        VARCHAR(200) UNIQUE NOT NULL,
        title       VARCHAR(300) NOT NULL,
        excerpt     TEXT,
        content     TEXT,
        image_url   VARCHAR(500),
        author      VARCHAR(100) DEFAULT 'PearlHeritageTours.com Team',
        published   BOOLEAN DEFAULT FALSE,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS accommodations (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(200) NOT NULL,
        location    VARCHAR(200),
        stars       INT,
        type        VARCHAR(100),    -- 'boutique', 'eco', 'luxury', 'budget'
        price_from  DECIMAL(10,2),
        description TEXT,
        image_url   VARCHAR(500),
        is_active   BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(200),
        email      VARCHAR(200),
        whatsapp   VARCHAR(50),
        subject    VARCHAR(300),
        message    TEXT,
        is_read    BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Tables created.');

    // ── SEED TOURS ───────────────────────────────────────────
    const { rowCount } = await client.query(`SELECT 1 FROM tours LIMIT 1`);
    if (rowCount === 0) {
      await client.query(`
        INSERT INTO tours (slug, name, category, type, duration, price_from, difficulty, description, highlights, image_url) VALUES
        ('colombo-day-tour',     'Day Tour of Colombo',          'day_tour',   'heritage',  '8 hours',   40,  'Easy',     'Discover Sri Lanka''s vibrant capital — colonial architecture, Pettah market, temples and Galle Face promenade.', ARRAY['Independence Square','Pettah Street Market','Gangaramaya Temple','Galle Face Green'], 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800'),
        ('galle-day-tour',       'Galle Day Tour',               'day_tour',   'heritage',  '9 hours',   45,  'Easy',     'Explore the 17th-century Dutch fortified city — cobblestone streets, lighthouse and boutique galleries.', ARRAY['Galle Fort Walls','Dutch Reformed Church','Lighthouse','Boutique Galleries'], 'https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=800'),
        ('geoffrey-bawa',        'Geoffrey Bawa Works',          'day_tour',   'heritage',  'Full Day',  95,  'Easy',     'Architectural pilgrimage through Sri Lanka''s most celebrated architect — Lunuganga, Brief Garden and Kandalama.', ARRAY['Lunuganga Estate','Brief Garden','Heritance Kandalama','Number 11 Colombo'], 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800'),
        ('hot-air-ballooning',   'Hot Air Ballooning',           'day_tour',   'adventure', 'Sunrise',   160, 'Easy',     'Soar above Sri Lanka''s Cultural Triangle at sunrise — temples, jungle and shimmering reservoirs below.', ARRAY['45-60 min flight','Champagne breakfast','Certificate & photos','Cultural Triangle views'], 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800'),
        ('kandy-day-tour',       'Kandy Day Tour',               'day_tour',   'heritage',  '9 hours',   55,  'Easy',     'Temple of the Tooth Relic, Royal Botanical Gardens and traditional Kandyan dance performance.', ARRAY['Temple of the Tooth','Royal Botanical Gardens','Kandyan Dance Show','Kandy Lake'], 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800'),
        ('white-water-rafting',  'Kithulgala White Water Rafting','day_tour',  'adventure', '7 hours',   45,  'Thrilling','Grade 3-4 rapids on the Kelani River through lush jungle hills of Kithulgala.', ARRAY['Grade 3-4 Rapids','Cliff Jumping','Waterfall Hike','Riverside Lunch'], 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'),
        ('little-england-tour',  'Little England Day Tour',      'day_tour',   'highlands', '10 hours',  70,  'Easy',     'Nuwara Eliya — tea factories, Victorian bungalows, Gregory Lake and misty highland gardens.', ARRAY['Tea Factory Visit','Gregory Lake','Victorian Hill Club','Tea Estate Walk'], 'https://images.unsplash.com/photo-1629393673286-ab7f1f5e9481?w=800'),
        ('sigiriya-dambulla',    'Sigiriya & Dambulla Day Tour', 'day_tour',   'heritage',  'Full Day',  65,  'Moderate', 'Scale the 200-metre Sigiriya Rock Fortress then explore the ornate Dambulla Cave Temple.', ARRAY['Sigiriya Rock Fortress','5th-century Frescoes','Lion Paw Terrace','Dambulla Cave Temple'], 'https://images.unsplash.com/photo-1625736300986-4e72be4fee78?w=800'),
        ('whale-watching',       'Whale Watching Day Tour',      'day_tour',   'ocean',     '6 hours',   55,  'Easy',     'Blue whales, sperm whales, spinner dolphins and sea turtles in Mirissa, Indian Ocean.', ARRAY['Blue Whale Sightings','Spinner Dolphins','Sea Turtles','Life Jackets Provided'], 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800'),
        ('yala-national-park',   'Yala National Park Day Tour',  'day_tour',   'wildlife',  'Full Day',  85,  'Easy',     'Highest leopard density on Earth. Full-day jeep safari with an expert naturalist guide.', ARRAY['Leopard Tracking','Wild Elephants','Sloth Bears','Expert Naturalist Guide'], 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800'),
        ('udawalawe-np',         'Udawalawe National Park',      'day_tour',   'wildlife',  'Full Day',  75,  'Easy',     'Home to over 600 wild elephants — the highest elephant density of any park in Sri Lanka.', ARRAY['600+ Wild Elephants','Elephant Transit Home','Water Buffalo','Crocodiles'], 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'),
        ('wilpattu-np',          'Wilpattu National Park',       'day_tour',   'wildlife',  'Full Day',  80,  'Easy',     'Sri Lanka''s largest and oldest park — natural lake basins, leopards and sloth bears.', ARRAY['Leopards','Sloth Bears','Natural Lake Basins','Pristine Wilderness'], 'https://images.unsplash.com/photo-1567526785848-b99a54be8a14?w=800'),

        ('adventure-nature-tour','Adventure & Nature Tours',     'itinerary',  'adventure', '10-14 Days', 980,  'Moderate','Rafting, whale watching, Ella hike, surfing and two national park safaris.', ARRAY['Kithulgala Rafting','Adam''s Peak Hike','Yala Safari','Whale Watching','Ella Rock'], 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'),
        ('culture-heritage-tour','Culture & Heritage Tours',     'itinerary',  'heritage',  '7-12 Days',  750,  'Easy',   'Colombo, Anuradhapura, Sigiriya, Kandy and Galle — 5,000 years of living history.', ARRAY['Anuradhapura Ancient City','Sigiriya Rock','Temple of the Tooth','Galle Fort'], 'https://images.unsplash.com/photo-1625736300986-4e72be4fee78?w=800'),
        ('family-tour',          'Family Tours',                 'itinerary',  'family',    '7-14 Days',  680,  'Easy',   'Kid-friendly itineraries — elephants, beaches, tuk tuks and friendly local culture.', ARRAY['Elephant Encounters','Beach Days','Tuk Tuk Rides','Wildlife Safaris'], 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800'),
        ('luxury-bespoke-tour',  'Luxury Bespoke Tours',        'itinerary',  'luxury',    'Flexible',   3200, 'Easy',   'Private villas, helicopter transfers, butler service and exclusive experiences.', ARRAY['Private Villas','Hot Air Balloon','Tea Planter Bungalow','Private Beach Villa'], 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800'),
        ('north-east-coast-tour','North & East Coast Tours',     'itinerary',  'adventure', '8-12 Days',  850,  'Moderate','Jaffna Tamil culture, Trincomalee beaches and the undiscovered north of Sri Lanka.', ARRAY['Jaffna Peninsula','Trincomalee Beaches','Point Pedro','Koneswaram Temple'], 'https://images.unsplash.com/photo-1533461502717-83546f485d24?w=800'),
        ('wildlife-tour',        'Wildlife Tours',               'itinerary',  'wildlife',  '8-12 Days',  1250, 'Easy',   'Five national parks, whale watching and endemic birds with an expert naturalist.', ARRAY['Wilpattu','Minneriya Elephant Gathering','Yala Safari','Mirissa Whales'], 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800'),
        ('sustainable-tour',     'Sustainable Tours',            'itinerary',  'eco',       '7-10 Days',  720,  'Easy',   'Carbon-conscious travel supporting local communities, eco-lodges and conservation.', ARRAY['Eco Lodges','Community Visits','Conservation Projects','Local Cuisine'], 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'),
        ('wellness-tour',        'Wellness Tours',               'itinerary',  'wellness',  '7-14 Days',  950,  'Easy',   'Ayurvedic retreats, jungle yoga, meditation and traditional healing.', ARRAY['Ayurveda Treatments','Jungle Yoga','Meditation Retreats','Spa Resorts'], 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800'),
        ('sports-tour',          'Sports Based Tours',           'itinerary',  'sports',    '7-14 Days',  680,  'Active', 'Cricket pilgrimages, surfing circuits, hiking and cycle touring.', ARRAY['Cricket Grounds','Surf Spots','Hiking Trails','Cycle Routes'], 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'),
        ('transit-tour',         'Special Transit Tours',        'itinerary',  'transit',   '1-3 Days',   120,  'Easy',   'Make the most of a Colombo layover — curated 1, 2 and 3-day transit experiences.', ARRAY['Colombo City','Day Trips','Airport Transfers','Flexible Timing'], 'https://images.unsplash.com/photo-1540188058764-0e7d0c14e34c?w=800'),
        ('romantic-tour',        'Romantic Tours',               'itinerary',  'romantic',  '8-14 Days',  1100, 'Easy',   'Honeymoon and couples travel — private beaches, candlelit dinners, sunset cruises.', ARRAY['Private Beach Villas','Sunset Dinners','Spa Treatments','Secluded Locations'], 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'),
        ('purpose-built-tour',   'Purpose Built Tours',          'itinerary',  'custom',    'Flexible',   NULL, 'Varies', 'Fully custom itineraries for corporate groups, special events and unique requirements.', ARRAY['Corporate Events','Destination Weddings','Film Logistics','Group Travel'], 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800')
        ON CONFLICT (slug) DO NOTHING;
      `);

      console.log('Tours seeded.');
    }

    // ── SEED BLOG POSTS ──────────────────────────────────────
    const { rowCount: blogCount } = await client.query(`SELECT 1 FROM blog_posts LIMIT 1`);
    if (blogCount === 0) {
      await client.query(`
        INSERT INTO blog_posts (slug, title, excerpt, author, published, image_url) VALUES
        ('best-time-visit-sri-lanka',    'Best Time to Visit Sri Lanka',               'Sri Lanka is a year-round destination, but timing your trip right makes all the difference. Here is our complete month-by-month guide.',                              'Rohan Perera',           TRUE,  'https://images.unsplash.com/photo-1625736300986-4e72be4fee78?w=800'),
        ('sigiriya-complete-guide',      'Sigiriya: The Complete Visitor Guide',        'Everything you need to know before climbing Sri Lanka''s most iconic rock fortress — opening times, tips and what to expect.',                                        'Amali Fernando',         TRUE,  'https://images.unsplash.com/photo-1625736300986-4e72be4fee78?w=800'),
        ('sri-lanka-train-journey',      'The World''s Most Scenic Train Journey',     'The Kandy to Ella train is consistently ranked one of the world''s great rail journeys. Here is how to make the most of it.',                                          'PearlHeritageTours.com Team',   TRUE,  'https://images.unsplash.com/photo-1629393673286-ab7f1f5e9481?w=800'),
        ('whale-watching-mirissa-guide', 'Whale Watching in Mirissa: Full Guide',       'When to go, which boat operator to choose, what to expect and how to spot a blue whale. Our definitive Mirissa guide.',                                               'Nimal Jayawardena',      TRUE,  'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800'),
        ('sri-lanka-travel-tips',        '20 Essential Sri Lanka Travel Tips',          'First time to Sri Lanka? These 20 tips from our guides will help you travel smarter, safer and more respectfully.',                                                    'PearlHeritageTours.com Team',   TRUE,  'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800')
        ON CONFLICT (slug) DO NOTHING;
      `);
      console.log('Blog posts seeded.');
    }

    // ── SEED ACCOMMODATIONS ──────────────────────────────────
    const { rowCount: accCount } = await client.query(`SELECT 1 FROM accommodations LIMIT 1`);
    if (accCount === 0) {
      await client.query(`
        INSERT INTO accommodations (name, location, stars, type, price_from, description, image_url) VALUES
        ('Heritance Kandalama',      'Dambulla',        5, 'luxury',   250, 'Geoffrey Bawa masterpiece carved into a rock face overlooking Kandalama reservoir.',         'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800'),
        ('Amanwella',                'Tangalle',        5, 'luxury',   800, 'One of Asia''s finest beach resorts — plunge pools, private beach and incredible dining.',     'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800'),
        ('98 Acres Resort',          'Ella',            4, 'boutique', 180, 'Sweeping tea estate views from private plunge pool villas in the Ella highlands.',            'https://images.unsplash.com/photo-1629393673286-ab7f1f5e9481?w=800'),
        ('Jetwing Yala',             'Yala',            4, 'wildlife', 200, 'Luxury tented safari lodge on the edge of Yala National Park.',                               'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800'),
        ('Secret Yala',              'Yala',            5, 'eco',      350, 'Ultra-exclusive glamping with private butler, plunge pool and full-board dining.',             'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'),
        ('Cinnamon Lodge Habarana',  'Habarana',        4, 'resort',   160, 'Set in 27 acres of landscaped gardens near the Cultural Triangle and Minneriya.',             'https://images.unsplash.com/photo-1625736300986-4e72be4fee78?w=800')
        ON CONFLICT DO NOTHING;
      `);
      console.log('Accommodations seeded.');
    }

    console.log('\n✅ Database setup complete!\n');
    console.log('Tables: tours, enquiries, blog_posts, accommodations, contact_messages');

  } catch (err) {
    console.error('Setup error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
