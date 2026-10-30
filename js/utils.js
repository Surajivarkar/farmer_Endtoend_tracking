/* ============================================================
   FARMER APP / KISANBOOK — Shared Utilities
   Trilingual Engine (English, मराठी, हिन्दी) + Material UI Helpers
   ============================================================ */

/* ── Toast Notification (Google Material 3 Floating Pill) ── */
let toastTimer;

function showToast(msg, type = 'info') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  
  t.textContent = msg;
  t.className = 'google-toast show ' + type;
  
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
  }, 2600);
}

/* ── Apply Language to all registered & data-i18n elements ── */
function applyLang(lang) {
  if (lang) {
    state.lang = lang;
  }
  const currentLang = state.lang || 'mr';
  const t = I18N[currentLang] || I18N.mr;

  // Set HTML lang attribute
  document.documentElement.lang = currentLang;

  // 1. Automatic translation by data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined && typeof t[key] === 'string') {
      if (t[key].includes('<')) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // 2. Attributes translation (e.g. placeholder, title, aria-label)
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const spec = el.getAttribute('data-i18n-attr');
    // Format: "placeholder:key,title:otherKey"
    spec.split(',').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (attr && key && t[key] !== undefined) {
        el.setAttribute(attr, t[key]);
      }
    });
  });

  // 3. Fallback for legacy ID-based mappings (backward compatibility)
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  set('hero-tagline', t.heroTag || t.tagline);
  set('card1-text',   t.card1);
  set('card2-text',   t.card2);
  set('instr1-title', t.i1t);
  set('instr1-body',  t.i1b);
  set('instr2-title', t.i2t);
  set('instr2-body',  t.i2b);
  set('instr3-title', t.i3t);
  set('instr3-body',  t.i3b);

  // 4. Update all select elements (legacy + new app-lang-wrap dropdown)
  document.querySelectorAll('.lang-select-nav, #lang-select, #langSelect, .nav-lang-select, #mobileLangSelect').forEach(sel => {
    sel.value = currentLang;
  });

  // 5. Update interactive language pills across all pages
  document.querySelectorAll('.lang-pill-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    if (btnLang === currentLang) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  // 6. Notify active page components (snake view, steps list, etc.)
  window.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { lang: currentLang, dictionary: t } 
  }));
}

/* ── Interactive Language Switcher ── */
function changeLang(lang) {
  if (!lang || !I18N[lang]) return;
  state.lang = lang;
  if (typeof saveState === 'function') {
    saveState();
  }
  applyLang(lang);

  const langNames = {
    mr: 'भाषा: मराठी',
    en: 'Language: English',
    hi: 'भाषा: हिन्दी'
  };
  showToast(langNames[lang] || 'Language updated', 'success');
}

/* ── Navigation Helper ── */
function goTo(page) {
  window.location.href = page;
}

/* ── Initialize language on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  applyLang();

  // Attach click listener to any language pill buttons
  document.querySelectorAll('.lang-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        changeLang(targetLang);
      }
    });
  });
});
