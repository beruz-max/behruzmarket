/* ============================================
   BEHRUZ.DEV — Skills Logic
   ============================================ */

function renderSkills(containerSelector = '#skills-grid') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const skills = Storage.getSkills();

  container.innerHTML = skills.map((s, i) => `
    <div class="skill-card glass reveal stagger-${(i % 4) + 1}">
      <div class="skill-header">
        <span class="skill-name">${s.name}</span>
        <span class="skill-percent">${s.percent}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-progress" data-percent="${s.percent}"></div>
      </div>
    </div>
  `).join('');

  // Animate bars when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const bar = entry.target.querySelector('.skill-progress');
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.dataset.percent + '%';
          }, 200);
        }
      }
    });
  }, { threshold: 0.2 });

  container.querySelectorAll('.skill-card').forEach(card => observer.observe(card));
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#skills-grid')) {
    renderSkills();
  }
});