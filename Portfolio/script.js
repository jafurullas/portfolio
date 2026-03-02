// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 1.5 + 0.5,
    color: ['#00f5ff','#ff00ff','#00ff88'][Math.floor(Math.random()*3)],
    alpha: Math.random() * 0.6 + 0.2
  });
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha;
    ctx.shadowColor = p.color; ctx.shadowBlur = 8; ctx.fill();
  });
  particles.forEach((a, i) => {
    particles.slice(i+1).forEach(b => {
      const dist = Math.hypot(a.x-b.x, a.y-b.y);
      if (dist < 120) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = '#00f5ff'; ctx.globalAlpha = (1-dist/120)*0.12;
        ctx.lineWidth = 0.5; ctx.shadowBlur = 0; ctx.stroke();
      }
    });
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== TYPING ANIMATION =====
const words = ['Full Stack Developer', 'Front-End Developer', 'UI/UX Designer'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed');
function type() {
  const word = words[wordIndex];
  if (isDeleting) {
    typedEl.textContent = word.substring(0, charIndex--);
    if (charIndex < 0) { isDeleting = false; wordIndex = (wordIndex+1) % words.length; setTimeout(type, 400); return; }
  } else {
    typedEl.textContent = word.substring(0, charIndex++);
    if (charIndex > word.length) { isDeleting = true; setTimeout(type, 1800); return; }
  }
  setTimeout(type, isDeleting ? 60 : 100);
}
type();

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== SKILL BARS =====
function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(fill => {
    fill.style.width = '0';
    setTimeout(() => fill.style.width = fill.dataset.width + '%', 100);
  });
}
const skillsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { animateSkills(); skillsObserver.unobserve(entries[0].target); }
}, { threshold: 0.2 });
const skillsEl = document.getElementById('skills');
if (skillsEl) skillsObserver.observe(skillsEl);

// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.about-tabs');
    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    parent.querySelector('#' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'skills') animateSkills();
  });
});

// ===== CONTACT FORM (Formspree) =====
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = document.getElementById('formMsg');
  const name = document.getElementById('cname').value.trim();
  const btn = form.querySelector('button[type="submit"]');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch('https://formspree.io/f/mdalrebb', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: document.getElementById('cemail').value,
        message: document.getElementById('cmessage').value
      })
    });

    if (response.ok) {
      msg.style.color = 'var(--neon3)';
      msg.textContent = `⚡ Thanks ${name}! Message sent — I'll reply soon!`;
      form.reset();
    } else {
      msg.style.color = '#ff4444';
      msg.textContent = '❌ Something went wrong. Please email me directly.';
    }
  } catch (err) {
    msg.style.color = '#ff4444';
    msg.textContent = '❌ Network error. Please try again.';
  }

  btn.textContent = 'Send Message ✈';
  btn.disabled = false;
  setTimeout(() => msg.textContent = '', 6000);
});

// ===== ACTIVE NAV ON SCROLL =====
window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section').forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--neon)' : '';
  });
});