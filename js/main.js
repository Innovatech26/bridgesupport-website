/* ═══════════════════════════════════════════════
   BridgeSupport — main.js
   ═══════════════════════════════════════════════ */

// ── NAVBAR SCROLL ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── MOBILE MENU ──────────────────────────────────
const mobMenu     = document.getElementById('mobMenu');
const mobBackdrop = document.getElementById('mobBackdrop');
const hamburger   = document.getElementById('hamburger');
const mobClose    = document.getElementById('mobClose');

function openMobile() {
  mobMenu.classList.add('open');
  mobBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobile() {
  mobMenu.classList.remove('open');
  mobBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobile);
mobClose.addEventListener('click', closeMobile);
mobBackdrop.addEventListener('click', closeMobile);

// ── SMOOTH SCROLL (renamed to avoid shadowing window.scrollTo) ──
function smoothScrollTo(href) {
  const target = document.querySelector(href);
  if (!target) return;
  const navH = navbar.offsetHeight + 8;
  const top  = target.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top, behavior: 'smooth' });
}

// All non-mobile anchor links (nav, hero buttons, footer, etc.)
document.querySelectorAll('a[href^="#"]:not(.mob-link)').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    smoothScrollTo(this.getAttribute('href'));
  });
});

// Mobile menu links — close panel first, then scroll after animation
document.querySelectorAll('.mob-link[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    closeMobile();
    setTimeout(() => smoothScrollTo(href), 360);
  });
});

// ── SCROLL REVEAL ────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el      = entry.target;
    const parent  = el.parentElement;
    const siblings = parent
      ? [...parent.querySelectorAll(':scope > .fade-up')]
      : [el];
    const idx = siblings.indexOf(el);
    setTimeout(() => el.classList.add('in'), idx * 80);
    revealObs.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

// ── CONTACT FORM — Web3Forms ──────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formMsg     = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const key = this.querySelector('[name="access_key"]').value.trim();
    if (!key || key === 'YOUR_KEY_HERE') {
      formMsg.className = 'form-msg err';
      formMsg.textContent =
        'Email not configured yet. See the comment in index.html — 2 minutes at web3forms.com.';
      return;
    }

    const original = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';
    formMsg.className = 'form-msg';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(this),
      });
      const data = await res.json();

      if (data.success) {
        formMsg.className = 'form-msg ok';
        formMsg.textContent = "✓ Message received! We'll be in touch within 24 hours.";
        this.reset();
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        submitBtn.style.background = '#1F4532';
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch {
      formMsg.className = 'form-msg err';
      formMsg.textContent = '✕ Something went wrong. Please try again.';
      submitBtn.innerHTML = original;
      submitBtn.disabled  = false;
    }
  });
}
