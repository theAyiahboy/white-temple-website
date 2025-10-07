/* White Temple Agency JS: nav, animations, quote forms */
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Current year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = $('#mobile-nav-toggle');
  const mobileMenu = $('#mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Hide menu on nav click
    $$('#mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
  }

  // Intersection Observer animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  $$('[data-animate]').forEach(el => observer.observe(el));

  // Quote modal
  const openers = $$('[data-open-quote]');
  const modal = $('#quote-modal');
  const overlay = $('#quote-overlay');
  const closer = $('[data-close-quote]');
  function openModal(){ if (modal) modal.classList.remove('hidden'); }
  function closeModal(){ if (modal) modal.classList.add('hidden'); }
  openers.forEach(btn => btn.addEventListener('click', openModal));
  if (overlay) overlay.addEventListener('click', closeModal);
  if (closer) closer.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Quote form handling (inline and modal)
  function handleQuoteForm(form, statusEl){
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      // very basic validation
      if (!data.name || !data.email || !data.phone || !data.message) {
        statusEl.textContent = 'Please complete all fields.';
        statusEl.className = 'text-sm text-red-600';
        return;
      }
      statusEl.textContent = 'Sending...';
      statusEl.className = 'text-sm text-gray-600';

      // Simulate async send; replace with Formspree or API if desired
      setTimeout(() => {
        statusEl.textContent = 'Thank you! We\'ve received your request and will contact you shortly.';
        statusEl.className = 'text-sm text-green-600';
        form.reset();
      }, 800);
    });
  }

  handleQuoteForm($('#quote-form'), $('#quote-status'));
  handleQuoteForm($('#quote-form-modal'), $('#quote-status-modal'));

  // Accent color extraction from logo -> sets CSS variables used by [data-accent]
  try {
    const logoSrc = './docs/white_temple_logo.png';
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const w = 64, h = 64;
        canvas.width = w; canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        const bins = new Map();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
          if (a < 128) continue; // ignore transparent
          // ignore near-white/near-black pixels
          if ((r > 245 && g > 245 && b > 245) || (r < 10 && g < 10 && b < 10)) continue;
          const qr = r >> 5, qg = g >> 5, qb = b >> 5; // 0..7
          const key = (qr << 10) | (qg << 5) | qb;
          let o = bins.get(key);
          if (!o) { o = { count: 0, r: 0, g: 0, b: 0 }; bins.set(key, o); }
          o.count++; o.r += r; o.g += g; o.b += b;
        }
        const arr = Array.from(bins.values()).sort((a, b) => b.count - a.count);
        if (arr.length) {
          const top = arr[0];
          const pr = Math.round(top.r / top.count);
          const pg = Math.round(top.g / top.count);
          const pb = Math.round(top.b / top.count);
          const primary = `rgb(${pr}, ${pg}, ${pb})`;
          const lighten = (r, g, b, amt=0.25) => {
            const lr = Math.round(r + (255 - r) * amt);
            const lg = Math.round(g + (255 - g) * amt);
            const lb = Math.round(b + (255 - b) * amt);
            return `rgb(${lr}, ${lg}, ${lb})`;
          };
          const from = lighten(pr, pg, pb, 0.35);
          document.documentElement.style.setProperty('--accent-to', primary);
          document.documentElement.style.setProperty('--accent-from', from);
          document.documentElement.style.setProperty('--accent-shadow', `rgba(${pr}, ${pg}, ${pb}, 0.25)`);
          // Re-apply to accent-marked elements
          $$('[data-accent]').forEach(el => {
            el.style.background = 'linear-gradient(to right, var(--accent-from), var(--accent-to))';
            if (el.classList.contains('shadow-accent')) {
              el.style.boxShadow = '0 10px 25px var(--accent-shadow)';
            }
          });
        }
      } catch (e) { /* ignore */ }
    };
    img.src = logoSrc;
  } catch (e) { /* ignore */ }

})();
