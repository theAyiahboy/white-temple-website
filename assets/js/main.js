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

})();
