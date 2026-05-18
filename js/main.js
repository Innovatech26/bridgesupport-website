
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40));


const mobileMenu = document.getElementById('mobileMenu');

function openMobile() {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobile() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('hamburger').addEventListener('click', openMobile);
document.getElementById('mobileClose').addEventListener('click', closeMobile);

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    closeMobile();
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  });
});

mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMobile();
});


const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = [...(el.parentElement?.children || [])].filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    setTimeout(() => el.classList.add('visible'), idx * 90);
    io.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));


document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


function handleSubmit(btn) {
  btn.textContent = 'Sending…';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
    btn.style.opacity = '1';
  }, 1500);
}
