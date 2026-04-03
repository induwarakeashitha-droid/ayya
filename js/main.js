// ============================================================
// BLOOMING SMILES — SHARED JAVASCRIPT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── INIT NAV BEHAVIOR (WITH RETRY) ──────────────────────
  // Uses a retry loop because layout.js injects the nav dynamically
  // and we need to wait until the elements exist in the DOM.
  function initNav() {
    const toggle   = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar   = document.getElementById('navbar');

    if (!toggle || !navLinks || !navbar) {
      // Nav not injected yet — retry in 50ms
      setTimeout(initNav, 50);
      return;
    }

    // ── SCROLL BEHAVIOR ──────────────────────────────────────
    const updateNav = () => {
      if (window.scrollY > 60) {
        navbar.classList.remove('transparent');
        navbar.classList.add('solid');
      } else {
        navbar.classList.remove('solid');
        navbar.classList.add('transparent');
      }
    };
    updateNav();
    window.addEventListener('scroll', updateNav);

    // ── Mark parent items that have sub-menus ──────────────
    navLinks.querySelectorAll('li').forEach(li => {
      if (li.querySelector('.nav-dropdown')) {
        li.classList.add('has-sub');
      }
    });

    // ── Helper: close everything ───────────────────────────
    function closeAll() {
      navLinks.classList.remove('open');
      toggle.classList.remove('is-open');
      navLinks.querySelectorAll('li.sub-open').forEach(li => li.classList.remove('sub-open'));
      document.body.style.overflow = '';
    }

    // ── Hamburger toggle ───────────────────────────────────
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const opening = !navLinks.classList.contains('open');
      if (opening) {
        navLinks.classList.add('open');
        toggle.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // lock background scroll
      } else {
        closeAll();
      }
    });

    // ── Accordion: tap parent link to expand/collapse ──────
    navLinks.querySelectorAll('li.has-sub > a').forEach(link => {
      link.addEventListener('click', (e) => {
        // Only intercept on mobile
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const li = link.parentElement;
        const wasOpen = li.classList.contains('sub-open');
        // Close all open sub-menus first
        navLinks.querySelectorAll('li.sub-open').forEach(el => el.classList.remove('sub-open'));
        // Open this one if it wasn't already
        if (!wasOpen) li.classList.add('sub-open');
      });
    });

    // ── Leaf links: close menu when tapped ────────────────
    navLinks.querySelectorAll('.nav-dropdown a').forEach(link => {
      link.addEventListener('click', () => closeAll());
    });

    // ── Close on outside click ─────────────────────────────
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !e.target.closest('#navbar') && !e.target.closest('.nav-links')) {
        closeAll();
      }
    });

    // ── Close on desktop resize ────────────────────────────
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeAll();
    });
  }

  // Kick off — DOMContentLoaded fires after layout.js has injected nav,
  // but retry handles any edge cases.
  initNav();


  // ── HERO SLIDESHOW ───────────────────────────────────────
  const track = document.querySelector('.slide-track');
  const dots = document.querySelectorAll('.slide-dot');
  const slides = document.querySelectorAll('.slide');
  let current = 0;
  let autoPlay;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAutoPlay() {
    autoPlay = setInterval(() => goTo(current + 1), 5500);
  }

  if (track && slides.length > 1) {
    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(autoPlay); goTo(i); startAutoPlay(); }));

    const prev = document.querySelector('.slide-arrow.prev');
    const next = document.querySelector('.slide-arrow.next');
    if (prev) prev.addEventListener('click', () => { clearInterval(autoPlay); goTo(current - 1); startAutoPlay(); });
    if (next) next.addEventListener('click', () => { clearInterval(autoPlay); goTo(current + 1); startAutoPlay(); });

    // Touch swipe
    let startX = 0;
    track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { clearInterval(autoPlay); goTo(current + (diff > 0 ? 1 : -1)); startAutoPlay(); }
    });

    goTo(0);
    startAutoPlay();
  }

  // ── ANIMATE ON SCROLL ────────────────────────────────────
  const aosEls = document.querySelectorAll('.aos');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  aosEls.forEach(el => observer.observe(el));

  // ── VEHICLE SELECTOR ────────────────────────────────────
  const vehicleOptions = document.querySelectorAll('.vehicle-option');
  const vehicleInfo = document.getElementById('vehicle-info');

  const vehicleData = {
    car:    { name: 'Car / SUV', pax: '1–3 Pax', desc: 'Ideal for solo travellers, couples or small families. Air-conditioned sedan or SUV with an experienced driver.', icon: '🚗' },
    van:    { name: 'KDH Van', pax: '4–8 Pax', desc: 'Comfortable air-conditioned passenger van — perfect for families or small groups exploring the island.', icon: '🚐' },
    coaster:{ name: 'Coaster Bus', pax: '9–25 Pax', desc: 'Mid-size coach ideal for medium groups. Comfortable seating with A/C and luggage space.', icon: '🚌' },
    bus:    { name: 'Coach Bus', pax: '26–45 Pax', desc: 'Full-size luxury coach for large groups. Reclining seats, A/C, PA system and ample luggage hold.', icon: '🚎' },
    tuktuk: { name: 'Tuk Tuk', pax: '1–2 Pax', desc: 'The iconic Sri Lankan three-wheeler! Perfect for short city tours with an authentic local experience.', icon: '🛺' },
  };

  vehicleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      vehicleOptions.forEach(v => v.classList.remove('active'));
      opt.classList.add('active');
      const key = opt.dataset.vehicle;
      if (vehicleInfo && vehicleData[key]) {
        vehicleInfo.innerHTML = `
          <div style="display:flex;align-items:center;gap:1rem;margin-top:1.2rem;padding:1.2rem;background:rgba(255,255,255,0.08);border-radius:8px;border-left:3px solid var(--gold)">
            <span style="font-size:2.5rem">${vehicleData[key].icon}</span>
            <div>
              <div style="font-family:var(--font-ui);font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold-light);margin-bottom:0.2rem">${vehicleData[key].name} · ${vehicleData[key].pax}</div>
              <p style="font-size:0.88rem;color:rgba(255,255,255,0.8);margin:0">${vehicleData[key].desc}</p>
            </div>
          </div>`;
      }
    });
  });

  // Auto-select car on load
  const firstVehicle = document.querySelector('.vehicle-option[data-vehicle="car"]');
  if (firstVehicle) firstVehicle.click();

  // ── GUIDE TOGGLE ─────────────────────────────────────────
  const guideOptions = document.querySelectorAll('.guide-option');
  guideOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      guideOptions.forEach(g => g.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // ── BOOKING FORM ─────────────────────────────────────────
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(bookingForm);
      const whatsapp = data.get('whatsapp');
      const tour = data.get('tour') || 'Custom Tour';
      const date = data.get('date') || 'Flexible';
      const pax = data.get('passengers') || '2';
      const vehicle = document.querySelector('.vehicle-option.active')?.dataset.vehicle || 'car';
      const guide = document.querySelector('.guide-option.active')?.dataset.guide || 'guide';
      
      const msg = encodeURIComponent(
        `🌴 *PearlHeritageTours.com — Tour Enquiry*\n\n` +
        `Tour: ${tour}\n` +
        `Date: ${date}\n` +
        `Passengers: ${pax}\n` +
        `Vehicle: ${vehicle}\n` +
        `Service: ${guide === 'guide' ? 'Driver + Guide' : 'Driver Only'}\n\n` +
        `Please send me more details!`
      );
      window.open(`https://wa.me/${whatsapp || '94771234567'}?text=${msg}`, '_blank');
    });
  }

  // ── WHATSAPP FLOAT ───────────────────────────────────────
  const waFloat = document.getElementById('wa-float');
  if (waFloat) {
    waFloat.addEventListener('click', () => {
      window.open('https://wa.me/94768329877?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20your%20Sri%20Lanka%20tours!', '_blank');
    });
  }

  // ── SMOOTH COUNTER ────────────────────────────────────────
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current.toLocaleString();
          if (current >= target) clearInterval(timer);
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

});
