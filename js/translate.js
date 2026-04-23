// ============================================================
// LANGUAGE SWITCHER — Pearl Heritage Tours
// Powered by Google Translate — reliably switches on click
// ============================================================

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

let gtReady = false;
let pendingLang = null;

// ── Google Translate callback (MUST be global) ─────────────
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: LANGUAGES.map(l => l.code).join(','),
    autoDisplay: false,
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  // Mark ready after brief initialization
  setTimeout(() => {
    gtReady = true;
    // If a language was clicked before GT loaded, apply it now
    if (pendingLang) {
      doTranslate(pendingLang);
      pendingLang = null;
    }
  }, 800);
}

// ── Core translate function ────────────────────────────────
function doTranslate(langCode) {
  const combo = document.querySelector('.goog-te-combo');
  if (!combo) {
    // GT not ready — set cookie and reload
    setCookie('googtrans', '/en/' + langCode);
    window.location.reload();
    return;
  }

  if (langCode === 'en') {
    // Reset to English
    combo.value = '';
    combo.dispatchEvent(new Event('change'));
    // Clear cookies
    setCookie('googtrans', '');
    deleteCookie('googtrans');
    // Sometimes need a reload for full reset
    setTimeout(() => {
      if (document.querySelector('.goog-te-banner-frame')) {
        setCookie('googtrans', '');
        deleteCookie('googtrans');
        window.location.reload();
      }
    }, 300);
  } else {
    // Set the target language
    combo.value = langCode;
    combo.dispatchEvent(new Event('change'));
  }
}

function changeLanguage(langCode) {
  localStorage.setItem('pht-lang', langCode);

  if (gtReady) {
    doTranslate(langCode);
  } else {
    // GT hasn't loaded yet — use cookie approach
    pendingLang = langCode;
    if (langCode === 'en') {
      deleteCookie('googtrans');
    } else {
      setCookie('googtrans', '/en/' + langCode);
    }
  }

  // Update UI
  updateSwitcherUI(langCode);
}

// ── Cookie helpers ─────────────────────────────────────────
function setCookie(name, value) {
  document.cookie = name + '=' + value + '; path=/';
  // Also set for domain (needed by Google Translate)
  const domain = window.location.hostname;
  if (domain && domain !== 'localhost') {
    document.cookie = name + '=' + value + '; path=/; domain=.' + domain;
  }
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  const domain = window.location.hostname;
  if (domain && domain !== 'localhost') {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domain;
  }
}

// ── Update the switcher button/dropdown ────────────────────
function updateSwitcherUI(langCode) {
  const langObj = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
  const currentEl = document.getElementById('lang-current');
  if (currentEl) {
    currentEl.textContent = langObj.code.split('-')[0].toUpperCase();
  }
  const dropdown = document.getElementById('lang-dropdown');
  if (dropdown) {
    dropdown.querySelectorAll('.lang-check').forEach(c => c.remove());
    const activeOpt = dropdown.querySelector('[data-lang="' + langCode + '"]');
    if (activeOpt) {
      activeOpt.insertAdjacentHTML('beforeend', '<span class="lang-check">✓</span>');
    }
  }
}

// ── Build the UI ───────────────────────────────────────────
function injectLanguageSwitcher() {
  const savedLang = localStorage.getItem('pht-lang') || 'en';

  const switcher = document.createElement('div');
  switcher.id = 'lang-switcher';
  switcher.innerHTML = `
    <button id="lang-btn" aria-label="Change Language" title="Change Language">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
      </svg>
      <span id="lang-current">${(LANGUAGES.find(l => l.code === savedLang) || LANGUAGES[0]).code.split('-')[0].toUpperCase()}</span>
    </button>
    <div id="lang-dropdown">
      <div class="lang-dropdown-header">🌐 Select Language</div>
      ${LANGUAGES.map(l => `
        <button class="lang-option" data-lang="${l.code}">
          <span class="lang-flag">${l.flag}</span>
          <span class="lang-name">${l.name}</span>
          ${l.code === savedLang ? '<span class="lang-check">✓</span>' : ''}
        </button>
      `).join('')}
    </div>
  `;
  document.body.appendChild(switcher);

  // Toggle dropdown
  document.getElementById('lang-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('lang-dropdown').classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', () => {
    document.getElementById('lang-dropdown').classList.remove('open');
  });
  document.getElementById('lang-dropdown').addEventListener('click', (e) => e.stopPropagation());

  // Language option click → translate page
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      changeLanguage(lang);
      document.getElementById('lang-dropdown').classList.remove('open');
    });
  });
}

// ── Inject CSS ─────────────────────────────────────────────
function injectLangStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Hide Google Translate chrome ─────────── */
    .goog-te-banner-frame { display: none !important; }
    #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
    .goog-te-spinner-pos { display: none !important; }
    .goog-tooltip, .goog-tooltip:hover { display: none !important; }
    .goog-text-highlight { background: none !important; box-shadow: none !important; }
    body { top: 0 !important; position: static !important; }
    .skiptranslate { display: none !important; height: 0 !important; }
    #google_translate_element { position: absolute; top: -9999px; left: -9999px; opacity: 0; }

    /* ── Language Switcher Button ─────────────── */
    #lang-switcher {
      position: fixed;
      bottom: 6.5rem;
      right: 2rem;
      z-index: 901;
    }
    #lang-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(26, 58, 42, 0.92);
      backdrop-filter: blur(12px);
      color: white;
      border: 1.5px solid rgba(201, 169, 110, 0.5);
      border-radius: 50px;
      padding: 0.6rem 1rem 0.6rem 0.8rem;
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    #lang-btn:hover {
      background: rgba(26, 58, 42, 1);
      border-color: #C9A96E;
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(0,0,0,0.35);
    }
    #lang-btn svg { opacity: 0.85; }
    #lang-current { text-transform: uppercase; }

    /* ── Dropdown Panel ──────────────────────── */
    #lang-dropdown {
      position: absolute;
      bottom: calc(100% + 0.6rem);
      right: 0;
      min-width: 210px;
      background: rgba(26, 58, 42, 0.97);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(201, 169, 110, 0.3);
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.4);
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(8px) scale(0.97);
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      max-height: 400px;
      overflow-y: auto;
    }
    #lang-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }
    .lang-dropdown-header {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #C9A96E;
      padding: 0.8rem 1rem 0.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      font-weight: 600;
    }
    .lang-option {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      width: 100%;
      padding: 0.65rem 1rem;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.85);
      font-family: 'Lato', sans-serif;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .lang-option:hover {
      background: rgba(201, 169, 110, 0.15);
      color: #E8D5A3;
      padding-left: 1.3rem;
    }
    .lang-option:last-child { border-bottom: none; }
    .lang-flag { font-size: 1.15rem; line-height: 1; }
    .lang-name { flex: 1; }
    .lang-check { color: #C9A96E; font-size: 0.85rem; font-weight: 700; }

    /* ── Scrollbar ────────────────────────────── */
    #lang-dropdown::-webkit-scrollbar { width: 4px; }
    #lang-dropdown::-webkit-scrollbar-track { background: transparent; }
    #lang-dropdown::-webkit-scrollbar-thumb {
      background: rgba(201,169,110,0.3);
      border-radius: 4px;
    }

    /* ── Mobile ───────────────────────────────── */
    @media (max-width: 768px) {
      #lang-switcher { bottom: 6rem; right: 1rem; }
      #lang-btn {
        padding: 0.5rem 0.8rem 0.5rem 0.65rem;
        font-size: 0.62rem;
      }
      #lang-btn svg { width: 16px; height: 16px; }
      #lang-dropdown { min-width: 185px; max-height: 330px; }
      .lang-option { padding: 0.55rem 0.9rem; font-size: 0.82rem; }
    }
  `;
  document.head.appendChild(style);
}

// ── Boot everything ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectLangStyles();

  // Hidden container for Google Translate
  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  document.body.appendChild(gtDiv);

  // Load Google Translate script
  const gtScript = document.createElement('script');
  gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  gtScript.async = true;
  document.body.appendChild(gtScript);

  // Inject the custom UI
  setTimeout(injectLanguageSwitcher, 150);

  // Auto-restore saved language
  const saved = localStorage.getItem('pht-lang');
  if (saved && saved !== 'en') {
    // Set cookies immediately so GT picks up the language on init
    setCookie('googtrans', '/en/' + saved);

    // Also try via combo after GT initializes
    const waitForGT = setInterval(() => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        clearInterval(waitForGT);
        combo.value = saved;
        combo.dispatchEvent(new Event('change'));
      }
    }, 400);
    setTimeout(() => clearInterval(waitForGT), 12000);
  }
});
