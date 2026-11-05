/* ============================================
   BEHRUZ.DEV — Admin Panel Logic
   DEMO ONLY — Use server-side auth in production
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Login page
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    return;
  }

  // Protect admin pages
  if (!Storage.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  initAdminSidebar();
  initAdminPage();
});

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.querySelector('.login-error');

  if (Storage.login(username, password)) {
    window.location.href = 'dashboard.html';
  } else {
    if (errorEl) {
      errorEl.textContent = 'Invalid credentials. Demo: norsafarov / behruzcr7';
      errorEl.classList.add('show');
    }
  }
}

function logout() {
  Storage.logout();
  window.location.href = 'login.html';
}

function initAdminSidebar() {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Highlight active link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

function initAdminPage() {
  const page = document.body.dataset.page;
  switch (page) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'projects':
      renderAdminProjects();
      break;
    case 'profile':
      renderAdminProfile();
      break;
    case 'skills':
      renderAdminSkills();
      break;
    case 'messages':
      renderAdminMessages();
      break;
    case 'settings':
      renderAdminSettings();
      break;
  }
}

function showToast(msg, isError = false) {
  let toast = document.querySelector('.admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* Dashboard */
function renderDashboard() {
  const projects = Storage.getProjects();
  const skills = Storage.getSkills();
  const messages = Storage.getMessages();
  const unread = messages.filter(m => !m.read).length;
  const activity = Storage.getActivity().slice(0, 8);

  const statsEl = document.getElementById('admin-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="admin-stat-card">
        <div class="label">Projects</div>
        <div class="value">${projects.length}</div>
      </div>
      <div class="admin-stat-card">
        <div class="label">Skills</div>
        <div class="value">${skills.length}</div>
      </div>
      <div class="admin-stat-card">
        <div class="label">Messages</div>
        <div class="value">${messages.length}</div>
      </div>
      <div class="admin-stat-card">
        <div class="label">Unread</div>
        <div class="value">${unread}</div>
      </div>
    `;
  }

  const logEl = document.getElementById('activity-log');
  if (logEl) {
    logEl.innerHTML = activity.length
      ? activity.map(a => `
          <li>
            <span>${a.action}</span>
            <span class="time">${new Date(a.time).toLocaleString()}</span>
          </li>
        `).join('')
      : '<li><span>No activity yet</span></li>';
  }
}

/* Projects CRUD */
function renderAdminProjects() {
  const projects = Storage.getProjects();
  const tbody = document.querySelector('#projects-table tbody');
  if (!tbody) return;

  tbody.innerHTML = projects.map(p => `
    <tr>
      <td>${p.title}</td>
      <td>${p.category}</td>
      <td>${(p.technologies || []).join(', ')}</td>
      <td>
        <button class="btn-admin btn-sm" onclick="editProject('${p.id}')">Edit</button>
        <button class="btn-danger btn-sm" onclick="deleteProject('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function showProjectForm(project = null) {
  const formArea = document.getElementById('project-form-area');
  if (!formArea) return;

  const isEdit = !!project;
  formArea.innerHTML = `
    <div class="admin-form">
      <h3 style="margin-bottom:1.5rem;font-family:monospace;color:var(--neon);">${isEdit ? 'Edit Project' : 'Add Project'}</h3>
      <form id="project-form">
        <input type="hidden" id="project-id" value="${project?.id || ''}">
        <div class="form-group">
          <label>Title</label>
          <input type="text" id="p-title" value="${project?.title || ''}" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <input type="text" id="p-category" value="${project?.category || ''}" required>
        </div>
        <div class="form-group">
          <label>Description (EN)</label>
          <textarea id="p-desc-en" required>${project?.description?.en || project?.description || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Description (UZ)</label>
          <textarea id="p-desc-uz">${project?.description?.uz || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Description (RU)</label>
          <textarea id="p-desc-ru">${project?.description?.ru || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Technologies (comma separated)</label>
          <input type="text" id="p-tech" value="${(project?.technologies || []).join(', ')}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Live URL</label>
            <input type="url" id="p-live" value="${project?.liveUrl || ''}">
          </div>
          <div class="form-group">
            <label>GitHub URL</label>
            <input type="url" id="p-github" value="${project?.githubUrl || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>Cover Image</label>
          <div class="upload-area">
            <input type="file" id="p-image" accept="image/*">
            <p>Click or drag image here</p>
            <img class="upload-preview ${project?.image ? 'show' : ''}" id="p-image-preview" src="${project?.image || ''}">
          </div>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="p-featured" ${project?.featured ? 'checked' : ''}> Featured
          </label>
        </div>
        <div style="display:flex;gap:0.8rem;">
          <button type="submit" class="btn-admin">${isEdit ? 'Update' : 'Add'} Project</button>
          <button type="button" class="btn-admin btn-admin-outline" onclick="hideProjectForm()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  formArea.style.display = 'block';

  document.getElementById('p-image').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const preview = document.getElementById('p-image-preview');
        preview.src = ev.target.result;
        preview.classList.add('show');
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('project-form').addEventListener('submit', saveProject);
}

function hideProjectForm() {
  const area = document.getElementById('project-form-area');
  if (area) {
    area.innerHTML = '';
    area.style.display = 'none';
  }
}

function saveProject(e) {
  e.preventDefault();
  const id = document.getElementById('project-id').value;
  const projects = Storage.getProjects();
  const preview = document.getElementById('p-image-preview');

  const data = {
    id: id || Date.now().toString(),
    title: document.getElementById('p-title').value.trim(),
    category: document.getElementById('p-category').value.trim(),
    description: {
      en: document.getElementById('p-desc-en').value.trim(),
      uz: document.getElementById('p-desc-uz').value.trim(),
      ru: document.getElementById('p-desc-ru').value.trim()
    },
    technologies: document.getElementById('p-tech').value.split(',').map(t => t.trim()).filter(Boolean),
    liveUrl: document.getElementById('p-live').value.trim(),
    githubUrl: document.getElementById('p-github').value.trim(),
    image: preview.classList.contains('show') ? preview.src : null,
    featured: document.getElementById('p-featured').checked
  };

  if (id) {
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) projects[idx] = data;
  } else {
    projects.push(data);
  }

  Storage.saveProjects(projects);
  hideProjectForm();
  renderAdminProjects();
  showToast(id ? 'Project updated' : 'Project added');
}

function editProject(id) {
  const projects = Storage.getProjects();
  const p = projects.find(pr => pr.id === id);
  if (p) showProjectForm(p);
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  let projects = Storage.getProjects();
  projects = projects.filter(p => p.id !== id);
  Storage.saveProjects(projects);
  renderAdminProjects();
  showToast('Project deleted');
}

/* Profile */
function renderAdminProfile() {
  const profile = Storage.getProfile();
  const form = document.getElementById('profile-form');
  if (!form) return;

  document.getElementById('profile-name').value = profile.name || '';
  document.getElementById('profile-email').value = profile.email || '';
  document.getElementById('profile-telegram').value = profile.telegram || '';
  document.getElementById('profile-github').value = profile.github || '';
  document.getElementById('profile-instagram').value = profile.instagram || '';
  document.getElementById('profile-bio-en').value = profile.bio?.en || '';
  document.getElementById('profile-bio-uz').value = profile.bio?.uz || '';
  document.getElementById('profile-bio-ru').value = profile.bio?.ru || '';
  document.getElementById('profile-about-en').value = profile.about?.en || '';
  document.getElementById('profile-about-uz').value = profile.about?.uz || '';
  document.getElementById('profile-about-ru').value = profile.about?.ru || '';

  const preview = document.getElementById('profile-image-preview');
  if (profile.image && preview) {
    preview.src = profile.image;
    preview.classList.add('show');
  }

  document.getElementById('profile-image').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        preview.src = ev.target.result;
        preview.classList.add('show');
      };
      reader.readAsDataURL(file);
    }
  });

  // CV upload
  const cvInput = document.getElementById('profile-cv');
  if (cvInput) {
    cvInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          profile.cv = ev.target.result;
          document.getElementById('cv-status').textContent = 'CV ready to save: ' + file.name;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: document.getElementById('profile-name').value.trim(),
      email: document.getElementById('profile-email').value.trim(),
      telegram: document.getElementById('profile-telegram').value.trim(),
      github: document.getElementById('profile-github').value.trim(),
      instagram: document.getElementById('profile-instagram').value.trim(),
      bio: {
        en: document.getElementById('profile-bio-en').value.trim(),
        uz: document.getElementById('profile-bio-uz').value.trim(),
        ru: document.getElementById('profile-bio-ru').value.trim()
      },
      about: {
        en: document.getElementById('profile-about-en').value.trim(),
        uz: document.getElementById('profile-about-uz').value.trim(),
        ru: document.getElementById('profile-about-ru').value.trim()
      },
      image: preview.classList.contains('show') ? preview.src : profile.image
    };
    Storage.saveProfile(updated);
    showToast('Profile saved');
  });
}

/* Skills CRUD */
function renderAdminSkills() {
  const skills = Storage.getSkills();
  const tbody = document.querySelector('#skills-table tbody');
  if (!tbody) return;

  tbody.innerHTML = skills.map(s => `
    <tr>
      <td>${s.name}</td>
      <td>${s.percent}%</td>
      <td>
        <button class="btn-admin btn-sm" onclick="editSkill('${s.id}')">Edit</button>
        <button class="btn-danger btn-sm" onclick="deleteSkill('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function showSkillForm(skill = null) {
  const area = document.getElementById('skill-form-area');
  if (!area) return;

  area.innerHTML = `
    <div class="admin-form">
      <h3 style="margin-bottom:1.5rem;font-family:monospace;color:var(--neon);">${skill ? 'Edit Skill' : 'Add Skill'}</h3>
      <form id="skill-form">
        <input type="hidden" id="skill-id" value="${skill?.id || ''}">
        <div class="form-group">
          <label>Skill Name</label>
          <input type="text" id="s-name" value="${skill?.name || ''}" required>
        </div>
        <div class="form-group">
          <label>Percent (0-100)</label>
          <input type="number" id="s-percent" min="0" max="100" value="${skill?.percent || 50}" required>
        </div>
        <div style="display:flex;gap:0.8rem;">
          <button type="submit" class="btn-admin">Save</button>
          <button type="button" class="btn-admin btn-admin-outline" onclick="document.getElementById('skill-form-area').innerHTML=''">Cancel</button>
        </div>
      </form>
    </div>
  `;

  document.getElementById('skill-form').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('skill-id').value;
    const skills = Storage.getSkills();
    const data = {
      id: id || Date.now().toString(),
      name: document.getElementById('s-name').value.trim(),
      percent: parseInt(document.getElementById('s-percent').value)
    };

    if (id) {
      const idx = skills.findIndex(s => s.id === id);
      if (idx !== -1) skills[idx] = data;
    } else {
      skills.push(data);
    }

    Storage.saveSkills(skills);
    area.innerHTML = '';
    renderAdminSkills();
    showToast('Skill saved');
  });
}

function editSkill(id) {
  const skills = Storage.getSkills();
  const s = skills.find(sk => sk.id === id);
  if (s) showSkillForm(s);
}

function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;
  let skills = Storage.getSkills();
  skills = skills.filter(s => s.id !== id);
  Storage.saveSkills(skills);
  renderAdminSkills();
  showToast('Skill deleted');
}

/* Messages */
function renderAdminMessages() {
  const messages = Storage.getMessages();
  const container = document.getElementById('messages-list');
  if (!container) return;

  if (!messages.length) {
    container.innerHTML = '<p style="color:var(--text-muted);">No messages yet.</p>';
    return;
  }

  container.innerHTML = messages.map(m => `
    <div class="admin-form" style="margin-bottom:1rem;opacity:${m.read ? 0.7 : 1}">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.8rem;">
        <div>
          <strong>${m.name}</strong> &lt;${m.email}&gt;
          ${!m.read ? '<span style="color:var(--neon);font-size:0.75rem;margin-left:0.5rem;">NEW</span>' : ''}
        </div>
        <span style="font-size:0.75rem;color:var(--text-muted);font-family:monospace;">${new Date(m.date).toLocaleString()}</span>
      </div>
      <p style="margin-bottom:0.5rem;"><strong>${m.subject}</strong></p>
      <p style="color:var(--text-muted);margin-bottom:1rem;">${m.message}</p>
      <div>
        ${!m.read ? `<button class="btn-admin btn-sm" onclick="markRead('${m.id}')">Mark Read</button>` : ''}
        <button class="btn-danger btn-sm" onclick="deleteMsg('${m.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function markRead(id) {
  Storage.markMessageRead(id);
  renderAdminMessages();
  showToast('Marked as read');
}

function deleteMsg(id) {
  if (!confirm('Delete this message?')) return;
  Storage.deleteMessage(id);
  renderAdminMessages();
  showToast('Message deleted');
}

/* Settings */
function renderAdminSettings() {
  const settings = Storage.getSettings();
  const form = document.getElementById('settings-form');
  if (!form) return;

  document.getElementById('set-sitename').value = settings.siteName || '';
  document.getElementById('set-tagline').value = settings.tagline || '';
  document.getElementById('set-showstats').checked = settings.showStats !== false;

  form.addEventListener('submit', e => {
    e.preventDefault();
    Storage.saveSettings({
      siteName: document.getElementById('set-sitename').value.trim(),
      tagline: document.getElementById('set-tagline').value.trim(),
      showStats: document.getElementById('set-showstats').checked
    });
    showToast('Settings saved');
  });
}