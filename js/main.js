// Navigation toggle
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// FAQ accordion
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  item.classList.toggle('open');
}

// Contact form submission
async function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const btn  = form.querySelector('.submit-btn');

  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(el => {
    el.style.borderColor = '';
    if (!el.value.trim()) { el.style.borderColor = '#f87171'; valid = false; }
  });
  if (!valid) return;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const data = Object.fromEntries(new FormData(form).entries());
    data.pain_points = [...form.querySelectorAll('input[name="pain[]"]:checked')].map(cb => cb.value);
    delete data['pain[]'];
    const res  = await fetch('https://ea-agency-backend.onrender.com/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed');
    document.getElementById('formWrap').style.display  = 'none';
    document.getElementById('successMsg').style.display = 'block';
  } catch {
    btn.textContent = 'Send Message — Let\'s Talk →';
    btn.disabled = false;
    alert('Something went wrong. Please email us directly at eaenterprises2026@gmail.com');
  }
}

// Fade-up on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
