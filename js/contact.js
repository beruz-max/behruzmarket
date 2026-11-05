/* ============================================
   BEHRUZ.DEV — Contact Form Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', handleContactSubmit);

  // Live validation
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group').classList.contains('error')) {
        validateField(input);
      }
    });
  });
});

function validateField(input) {
  const group = input.closest('.form-group');
  const errorEl = group.querySelector('.error');
  let valid = true;
  let message = '';

  if (input.hasAttribute('required') && !input.value.trim()) {
    valid = false;
    message = t('required');
  } else if (input.type === 'email' && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      valid = false;
      message = t('invalid_email');
    }
  }

  if (!valid) {
    group.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  } else {
    group.classList.remove('error');
  }
  return valid;
}

function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input, textarea');
  let allValid = true;

  inputs.forEach(input => {
    if (!validateField(input)) allValid = false;
  });

  if (!allValid) return;

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  };

  // Save to localStorage (demo). In production connect to a real backend / Formspree / EmailJS.
  try {
    Storage.saveMessage(data);

    const successEl = form.querySelector('.form-success');
    if (successEl) {
      successEl.textContent = t('contact_success');
      successEl.classList.add('show');
    }

    form.reset();
    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    setTimeout(() => {
      if (successEl) successEl.classList.remove('show');
    }, 5000);
  } catch (err) {
    console.error(err);
    alert(t('contact_error'));
  }
}

function loadContactInfo() {
  const profile = Storage.getProfile();
  const emailEl = document.querySelector('[data-contact="email"]');
  const telegramEl = document.querySelector('[data-contact="telegram"]');
  const githubEl = document.querySelector('[data-contact="github"]');
  const instagramEl = document.querySelector('[data-contact="instagram"]');

  if (emailEl) {
    emailEl.href = `mailto:${profile.email}`;
    emailEl.textContent = profile.email;
  }
  if (telegramEl) {
    telegramEl.href = profile.telegram || '#';
    telegramEl.textContent = profile.telegram ? 'Telegram' : '—';
  }
  if (githubEl) {
    githubEl.href = profile.github || '#';
  }
  if (instagramEl) {
    instagramEl.href = profile.instagram || '#';
  }
}

document.addEventListener('DOMContentLoaded', loadContactInfo);