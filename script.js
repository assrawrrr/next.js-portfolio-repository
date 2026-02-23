/**
 * script.js
 * Personal branding site — [NAME]
 * Handles: navbar scroll state, mobile menu, scroll reveal,
 *          marquee cloning, note card modals, footer year.
 */

'use strict';

/* ──────────────────────────────────────────
   UTILITY: wait for DOM
────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initMarquee();
  initNoteModals();
  initFooterYear();
});

/* ──────────────────────────────────────────
   NAVBAR: scroll shadow + mobile toggle
────────────────────────────────────────── */
function initNav() {
  const nav        = document.getElementById('nav');
  const toggle     = document.getElementById('navToggle');
  const links      = document.getElementById('navLinks');
  const navLinkEls = links.querySelectorAll('.nav__link');

  // Scroll → add .scrolled class
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile hamburger toggle
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu when a link is clicked
  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ──────────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => io.observe(el));
}

/* ──────────────────────────────────────────
   MARQUEE: clone items for seamless loop
────────────────────────────────────────── */
function initMarquee() {
  const track = document.querySelector('.marquee__track');
  if (!track) return;

  // Clone all children and append for infinite scroll illusion
  const items = Array.from(track.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  // Pause on hover (via CSS) — but also pause on reduced-motion preference
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    track.style.animationPlayState = 'paused';
  }
}

/* ──────────────────────────────────────────
   NOTE MODALS
────────────────────────────────────────── */
function initNoteModals() {
  const modal         = document.getElementById('modal');
  const backdrop      = document.getElementById('modalBackdrop');
  const closeBtn      = document.getElementById('modalClose');
  const modalDate     = document.getElementById('modalDate');
  const modalTitle    = document.getElementById('modalTitle');
  const modalBody     = document.getElementById('modalBody');
  const noteCards     = document.querySelectorAll('.note__card');

  if (!modal) return;

  function openModal(card) {
    // Pull data from the card's data attributes
    const title = card.dataset.title  || '';
    const date  = card.dataset.date   || '';
    const body  = card.dataset.body   || '';

    modalDate.textContent  = date;
    modalTitle.textContent = title;
    // Render body as paragraphs (split on double newline or use as single block)
    modalBody.innerHTML = body
      .split(/\n\n+/)
      .map(p => `<p style="margin-bottom:1.25rem;">${p.trim()}</p>`)
      .join('');

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  noteCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));

    // Keyboard: Enter or Space to open
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // Close triggers
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ──────────────────────────────────────────
   FOOTER YEAR
────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────
   SUBTLE CURSOR ACCENT (desktop only)
   Adds a soft trailing dot in the accent color.
   Remove this block if you prefer no custom cursor.
────────────────────────────────────────── */
(function initCursorDot() {
  // Only on non-touch, non-reduced-motion devices
  const noTouch = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const noReduce = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!noTouch || !noReduce) return;

  const dot = document.createElement('div');
  dot.style.cssText = [
    'position:fixed',
    'top:0','left:0',
    'width:6px','height:6px',
    'border-radius:50%',
    'background:var(--accent)',
    'pointer-events:none',
    'z-index:9999',
    'opacity:0',
    'transition:opacity 0.3s',
    'transform:translate(-50%,-50%)',
    'will-change:transform',
  ].join(';');
  document.body.appendChild(dot);

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let visible = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) {
      dot.style.opacity = '0.55';
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    visible = false;
  });

  // Lag the dot slightly behind cursor
  function animate() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animate);
  }
  animate();
})();
