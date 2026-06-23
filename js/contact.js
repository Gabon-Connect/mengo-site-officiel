/* ============================================================
   DMS — Contact Form : Validation + Submission Handler
   ============================================================ */

(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  /* ── Character counter ─────────────────────────────────── */
  const textarea = document.getElementById('message');
  const charCount = document.getElementById('char-count');
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 490 ? 'var(--red)' : len > 450 ? 'var(--gold)' : 'var(--dim)';
    });
  }

  /* ── Field validators ──────────────────────────────────── */
  const validators = {
    nom:       v => v.trim().length >= 2         ? '' : 'Veuillez saisir votre nom complet',
    email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Adresse email invalide',
    telephone: v => v.trim().replace(/\s/g, '').length >= 8     ? '' : 'Numéro de téléphone invalide',
    service:   v => v !== ''                     ? '' : 'Veuillez sélectionner un service',
    message:   v => v.trim().length >= 20        ? '' : 'Message trop court (20 caractères minimum)',
  };

  /* ── Real-time validation on blur / input ──────────────── */
  Object.keys(validators).forEach(field => {
    const el     = form.querySelector(`#${field}`);
    const errEl  = form.querySelector(`#${field}-error`);
    if (!el || !errEl) return;

    const validate = () => {
      const msg = validators[field](el.value);
      errEl.textContent = msg;
      el.classList.toggle('error', !!msg);
      return !msg;
    };

    el.addEventListener('blur',  validate);
    el.addEventListener('input', () => { if (el.classList.contains('error')) validate(); });
    if (el.tagName === 'SELECT') el.addEventListener('change', validate);
  });

  /* ── Form submit ───────────────────────────────────────── */
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Honeypot
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    // Full validation
    let valid = true;
    Object.keys(validators).forEach(field => {
      const el    = form.querySelector(`#${field}`);
      const errEl = form.querySelector(`#${field}-error`);
      if (!el || !errEl) return;
      const msg = validators[field](el.value);
      errEl.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) valid = false;
    });

    if (!valid) {
      // Scroll to first error
      const first = form.querySelector('.error');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    /* ── Loading state ─────────────────────────────────── */
    const btn         = document.getElementById('submit-btn');
    const submitText  = btn.querySelector('.submit-text');
    const submitLoad  = btn.querySelector('.submit-loading');
    btn.disabled      = true;
    submitText.style.display = 'none';
    submitLoad.style.display = '';

    /* ── Simulate async submission ─────────────────────── */
    setTimeout(() => {
      // Show success — hide all form children except #form-success
      Array.from(form.children).forEach(child => {
        if (child.id === 'form-success') {
          child.style.display = '';
        } else {
          child.style.display = 'none';
        }
      });
    }, 1800);
  });

  /* ── Input focus → remove global error class ───────────── */
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
    el.addEventListener('focus', () => el.classList.remove('error'));
  });

})();
