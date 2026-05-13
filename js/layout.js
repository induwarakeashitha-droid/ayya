// ============================================================
// SHARED LAYOUT COMPONENTS
// ============================================================

const SITE_ROOT_PATH = '../'; // adjust per page depth
var SITE_ROOT = typeof window.SITE_ROOT !== 'undefined' ? window.SITE_ROOT : '../';

function renderNav(activePage = '') {
  return `
<nav id="navbar" class="transparent" role="navigation" aria-label="Main Navigation">
  <div class="nav-inner">
    <a href="${SITE_ROOT}index.html" class="nav-logo">
      Pearl Heritage Tours 
      <span>Make the sri lanka experience unforgettable</span>
    </a>
    <ul class="nav-links">
      <li><a href="${SITE_ROOT}index.html">Home</a></li>
      <li>
        <a href="${SITE_ROOT}pages/accommodation.html">Accommodation ▾</a>
        <ul class="nav-dropdown">
          <li><a href="${SITE_ROOT}pages/accommodation.html">Browse Hotels</a></li>
          <li><a href="${SITE_ROOT}pages/accommodation.html#boutique">Boutique Hotels</a></li>
          <li><a href="${SITE_ROOT}pages/accommodation.html#eco">Eco Lodges</a></li>
        </ul>
      </li>
      <li>
        <a href="${SITE_ROOT}pages/tours.html">Tours ▾</a>
        <ul class="nav-dropdown">
          <li><a href="${SITE_ROOT}pages/tours.html#colombo">Classic Sri Lanka Circuit
</a></li>
          <li><a href="${SITE_ROOT}pages/tours.html#galle">Wildlife Safari Express
</a></li>
          <li><a href="${SITE_ROOT}pages/tours.html#bawa">Pearl of the Indian Ocean
</a></li>
          <li><a href="${SITE_ROOT}pages/tours.html#ballooning">Family Discovery Sri Lanka
</a></li>
          <li><a href="${SITE_ROOT}pages/tours.html#kandy">Romantic Escape — Ceylon Dream
</a></li>
          <li><a href="${SITE_ROOT}pages/tours.html#rafting">Adventure Rush Sri Lanka
</a></li>
          
        </ul>
      </li>
      <li>
        <a href="${SITE_ROOT}pages/itineraries.html">Itineraries ▾</a>
        <ul class="nav-dropdown">
          <li><a href="${SITE_ROOT}pages/itineraries.html#adventure">Adventure &amp; Nature</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#culture">Culture &amp; Heritage</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#family">Family Tours</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#luxury">Luxury Bespoke</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#north">North &amp; East Coast</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#wildlife">Wildlife Tours</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#sustainable">Sustainable Tours</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#wellness">Wellness Tours</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#sports">Sports Based Tours</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#romantic">Romantic Tours</a></li>
          <li><a href="${SITE_ROOT}pages/itineraries.html#transit">Special Transit Tours</a></li>
        </ul>
      </li>
      <li>
        <a href="#">Discover Sri Lanka ▾</a>
        <ul class="nav-dropdown">
          <li><a href="${SITE_ROOT}pages/discover.html">About Sri Lanka</a></li>
          <li><a href="${SITE_ROOT}pages/discover.html#regions">Regions &amp; Highlights</a></li>
          <li><a href="${SITE_ROOT}pages/discover.html#weather">Best Time to Visit</a></li>
          <li><a href="${SITE_ROOT}pages/travel-tips.html">Travel Tips</a></li>
          <li><a href="${SITE_ROOT}pages/train-tickets.html">Book Train Tickets</a></li>
          <li><a href="${SITE_ROOT}pages/transfers.html">Sri Lanka Transfers</a></li>
        </ul>
      </li>
      <li>
        <a href="#">About ▾</a>
        <ul class="nav-dropdown">
          <li><a href="${SITE_ROOT}pages/about.html">About Us</a></li>
          <li><a href="${SITE_ROOT}pages/about.html#dmc">DMC in Sri Lanka</a></li>
          <li><a href="${SITE_ROOT}pages/little-hearts.html">Little Hearts Project</a></li>
          <li><a href="${SITE_ROOT}pages/blog.html">Blog</a></li>
        </ul>
      </li>
      <li><a href="${SITE_ROOT}pages/contact.html">Contact</a></li>
    </ul>
    <a href="${SITE_ROOT}pages/contact.html" class="btn btn-gold nav-btn-desktop" style="font-size:0.65rem;padding:0.65rem 1.4rem">Get A Quote</a>
    <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;
}

function renderFooter() {
  const currentYear = new Date().getFullYear();
  return `
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <div class="nav-logo">PearlHeritageTours.com <span>Sri Lanka Tours</span></div>
      <p>Your trusted DMC partner in Sri Lanka. Crafting unforgettable journeys across the Pearl of the Indian Ocean since 2005.</p>
      <div style="margin-top:1.5rem;display:flex;gap:0.8rem">
        <a href="https://www.facebook.com/pearlheritagetours" target="_blank" rel="noopener" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.9rem;transition:all 0.2s" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">f</a>
        <a href="https://www.instagram.com/pearlheritagetours" target="_blank" rel="noopener" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.9rem;transition:all 0.2s" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" title="Instagram">📷</a>
        <a href="https://www.youtube.com/pearlheritagetours" target="_blank" rel="noopener" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.9rem;transition:all 0.2s" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" title="YouTube">▶</a>
        <a href="https://wa.me/94768329877" target="_blank" rel="noopener" style="width:36px;height:36px;background:rgba(255,255,255,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.9rem;transition:all 0.2s" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'" title="WhatsApp">💬</a>
      </div>
    </div>
    <div class="footer-col">
      <h5>Tours</h5>
      <ul>
        <li><a href="${SITE_ROOT}pages/tours.html#classic">Classic Sri Lankan Circuit</a></li>
        <li><a href="${SITE_ROOT}pages/tours.html#wildlife">Wildlife Safari Express</a></li>
        <li><a href="${SITE_ROOT}pages/tours.html#luxury">Pearl of the Indian Ocean</a></li>
        <li><a href="${SITE_ROOT}pages/tours.html#family">Family Discovery Sri Lanka</a></li>
        <li><a href="${SITE_ROOT}pages/itineraries.html">View All Itineraries</a></li>
        <li><a href="${SITE_ROOT}pages/tours.html">Discover More Tours</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h5>Itineraries</h5>
      <ul>
        <li><a href="${SITE_ROOT}pages/itineraries.html#luxury">Luxury Bespoke</a></li>
        <li><a href="${SITE_ROOT}pages/itineraries.html#wildlife">Wildlife Tours</a></li>
        <li><a href="${SITE_ROOT}pages/itineraries.html#culture">Culture & Heritage</a></li>
        <li><a href="${SITE_ROOT}pages/itineraries.html#family">Family Tours</a></li>
        <li><a href="${SITE_ROOT}pages/itineraries.html#romantic">Romantic Tours</a></li>
        <li><a href="${SITE_ROOT}pages/itineraries.html#wellness">Wellness Tours</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h5>Quick Links</h5>
      <ul>
        <li><a href="${SITE_ROOT}pages/about.html">About Us</a></li>
        <li><a href="${SITE_ROOT}pages/blog.html">Blog</a></li>
        <li><a href="${SITE_ROOT}pages/travel-tips.html">Travel Tips</a></li>
        <li><a href="${SITE_ROOT}pages/transfers.html">Airport Transfers</a></li>
        <li><a href="${SITE_ROOT}pages/contact.html">Contact Us</a></li>
        <li><a href="${SITE_ROOT}pages/booking-terms.html">Booking Terms</a></li>
        <li><a href="${SITE_ROOT}pages/cookie-policy.html">Cookie Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span> ©${currentYear} Pearl Heritage Tours. All rights reserved. </span>
    <span>Designed by <a href="https://aurawebsolution.online/" target="_blank" rel="noopener" >Induwara Senevirathne</a></span>
  </div>

</footer>

<!-- WhatsApp Float -->
<div class="whatsapp-float" id="wa-float" title="Chat on WhatsApp" role="button" aria-label="Chat with us on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</div>`;
}

// Inject into page
document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('nav-placeholder');
  if (navEl) navEl.outerHTML = renderNav();
  const footEl = document.getElementById('footer-placeholder');
  if (footEl) footEl.outerHTML = renderFooter();
});