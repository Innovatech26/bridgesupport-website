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
    const siblings = [...(el.parentElement?.children || [])]
      .filter(c => c.classList.contains('reveal'));
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

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn = this.querySelector("button");
  btn.textContent = "Sending...";
  btn.disabled = true;

  const formData = {
    first_name: this.first_name.value,
    last_name: this.last_name.value,
    email: this.email.value,
    service: this.service.value,
    message: this.message.value,
  };

  const API_URL =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : "https://newmail.onrender.com";

  try {
    const res = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Request failed");

    const data = await res.json();

    if (data.success) {
      btn.textContent = "✓ Message Sent!";
    } else {
      throw new Error("Server error");
    }

  } catch (error) {
    console.error("FETCH ERROR:", error);
    btn.textContent = "❌ Failed. Try again.";
    btn.disabled = false;
  }
});