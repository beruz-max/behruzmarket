/* ============================================
   BEHRUZ.DEV — Projects Logic
   ============================================ */

function renderProjects(containerSelector = '#projects-grid', featuredOnly = false) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let projects = Storage.getProjects();
  if (featuredOnly) {
    projects = projects.filter(p => p.featured).slice(0, 4);
  }

  const lang = Storage.getLang();
  const filter = container.dataset.filter || 'all';

  if (filter !== 'all') {
    projects = projects.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));
  }

  if (!projects.length) {
    container.innerHTML = `<p class="text-center" style="color:var(--text-muted);grid-column:1/-1;">No projects found.</p>`;
    return;
  }

  container.innerHTML = projects.map((p, i) => {
    const desc = typeof p.description === 'object' ? (p.description[lang] || p.description.en) : p.description;
    const imgContent = p.image
      ? `<img src="${p.image}" alt="${p.title}" loading="lazy">`
      : `<span>${p.title}</span>`;

    const githubBtn = p.githubUrl
      ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-ghost">${t('github')}</a>`
      : '';

    return `
      <article class="project-card glass reveal stagger-${(i % 4) + 1}" data-category="${p.category}">
        <div class="project-img">${imgContent}</div>
        <div class="project-body">
          <span class="project-category">${p.category}</span>
          <h3>${p.title}</h3>
          <p>${desc}</p>
          <div class="project-tech">
            ${(p.technologies || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-actions">
            <a href="${p.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary">${t('live_demo')}</a>
            ${githubBtn}
            <button class="btn btn-outline" onclick="openProjectModal('${p.id}')">${t('view_details')}</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Re-init reveal for new elements
  if (typeof initScrollReveal === 'function') {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.15 });
      observer.observe(el);
    });
  }
}

function openProjectModal(id) {
  const projects = Storage.getProjects();
  const p = projects.find(pr => pr.id === id);
  if (!p) return;

  const lang = Storage.getLang();
  const desc = typeof p.description === 'object' ? (p.description[lang] || p.description.en) : p.description;

  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  const imgHtml = p.image
    ? `<img class="modal-img" src="${p.image}" alt="${p.title}">`
    : `<div class="modal-img" style="display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);color:var(--neon);">${p.title}</div>`;

  const githubBtn = p.githubUrl
    ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-ghost">${t('github')}</a>`
    : '';

  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" aria-label="Close">&times;</button>
      <div class="modal-body">
        ${imgHtml}
        <span class="project-category">${p.category}</span>
        <h2 style="margin:0.5rem 0 1rem;">${p.title}</h2>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;">${desc}</p>
        <div class="project-tech" style="margin-bottom:1.5rem;">
          ${(p.technologies || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-actions">
          <a href="${p.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary">${t('live_demo')}</a>
          ${githubBtn}
        </div>
      </div>
    </div>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const grid = document.querySelector('#projects-grid');
  if (!buttons.length || !grid) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      grid.dataset.filter = btn.dataset.filter || 'all';
      renderProjects('#projects-grid', false);
    });
  });
}

// Auto-init on projects page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#projects-grid')) {
    const featured = document.querySelector('#projects-grid').dataset.featured === 'true';
    renderProjects('#projects-grid', featured);
    initProjectFilters();
  }
});