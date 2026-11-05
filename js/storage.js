/* ============================================
   BEHRUZ.DEV — LocalStorage Manager
   Demo data persistence
   ============================================ */

const Storage = {
  KEYS: {
    PROFILE: 'behruz_profile',
    PROJECTS: 'behruz_projects',
    SKILLS: 'behruz_skills',
    MESSAGES: 'behruz_messages',
    SETTINGS: 'behruz_settings',
    ACTIVITY: 'behruz_activity',
    LANG: 'behruz_lang',
    AUTH: 'behruz_auth'
  },

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // Profile
  getProfile() {
    return this.get(this.KEYS.PROFILE) || this.defaultProfile();
  },

  saveProfile(profile) {
    this.set(this.KEYS.PROFILE, profile);
    this.logActivity('Profile updated');
  },

  defaultProfile() {
    return {
      name: 'Behruz Norsafarov',
      title: {
        uz: 'Frontend Developer',
        en: 'Frontend Developer',
        ru: 'Frontend Developer'
      },
      bio: {
        uz: 'Men zamonaviy, tezkor va chiroyli veb-ilovalar yaratishga ixtisoslashgan frontend dasturchiman. Har bir loyihada mukammallikka intilaman.',
        en: 'I am a frontend developer specializing in building modern, fast and beautiful web applications. I strive for excellence in every project.',
        ru: 'Я фронтенд-разработчик, специализирующийся на создании современных, быстрых и красивых веб-приложений. Стремлюсь к совершенству в каждом проекте.'
      },
      about: {
        uz: 'Salom! Men Behruz Norsafarovman — frontend dasturchi va UI/UX dizayner. Veb-texnologiyalar dunyosiga 2022-yilda qadam qo‘ydim. O‘shandan beri HTML, CSS, JavaScript va zamonaviy dizayn prinsiplarini chuqur o‘rganib, bir nechta real loyihalarni amalga oshirdim. Mening maqsadim — foydalanuvchilar uchun qulay, tezkor va estetik jihatdan mukammal interfeyslar yaratish.',
        en: 'Hello! I am Behruz Norsafarov — a frontend developer and UI/UX designer. I entered the world of web technologies in 2022. Since then I have deeply studied HTML, CSS, JavaScript and modern design principles, and completed several real projects. My goal is to create convenient, fast and aesthetically perfect interfaces for users.',
        ru: 'Привет! Я Бехруз Норсафаров — фронтенд-разработчик и UI/UX дизайнер. В мир веб-технологий я вошёл в 2022 году. С тех пор глубоко изучил HTML, CSS, JavaScript и современные принципы дизайна, реализовал несколько реальных проектов. Моя цель — создавать удобные, быстрые и эстетически совершенные интерфейсы для пользователей.'
      },
      email: 'behruz@behruz.dev',
      telegram: 'https://t.me/behruznorsafarov',
      github: 'https://github.com/behruznorsafarov',
      instagram: 'https://instagram.com/behruznorsafarov',
      location: {
        uz: 'O‘zbekiston',
        en: 'Uzbekistan',
        ru: 'Узбекистан'
      },
      experience: '3+',
      projectsCount: '10+',
      clients: '5+',
      image: null,
      cv: null,
      journey: [
        {
          year: '2022',
          title: { uz: 'Boshlanish', en: 'The Beginning', ru: 'Начало' },
          desc: { uz: 'Veb-dasturlashni o‘rganishni boshladim. HTML va CSS asoslarini o‘zlashtirdim.', en: 'Started learning web development. Mastered HTML and CSS basics.', ru: 'Начал изучать веб-разработку. Освоил основы HTML и CSS.' }
        },
        {
          year: '2023',
          title: { uz: 'JavaScript va loyihalar', en: 'JavaScript & Projects', ru: 'JavaScript и проекты' },
          desc: { uz: 'JavaScriptni chuqur o‘rgandim. Birinchi real loyihalarimni yaratdim.', en: 'Deeply studied JavaScript. Created my first real projects.', ru: 'Глубоко изучил JavaScript. Создал первые реальные проекты.' }
        },
        {
          year: '2024',
          title: { uz: 'Professional o‘sish', en: 'Professional Growth', ru: 'Профессиональный рост' },
          desc: { uz: 'UI/UX dizayn va responsive developmentga e’tibor qaratdim. Portfolio loyihalarini ishlab chiqdim.', en: 'Focused on UI/UX design and responsive development. Built portfolio projects.', ru: 'Сфокусировался на UI/UX дизайне и адаптивной разработке. Создал портфолио-проекты.' }
        },
        {
          year: '2025-2026',
          title: { uz: 'Hozirgi bosqich', en: 'Current Stage', ru: 'Текущий этап' },
          desc: { uz: 'Murakkab interfeyslar, performance optimizatsiya va shaxsiy brend yaratish ustida ishlayman.', en: 'Working on complex interfaces, performance optimization and personal branding.', ru: 'Работаю над сложными интерфейсами, оптимизацией производительности и личным брендом.' }
        }
      ],
      philosophy: {
        uz: 'Kod — bu san’at. Har bir qator o‘ylangan, har bir interfeys foydalanuvchi uchun yaratilgan bo‘lishi kerak.',
        en: 'Code is art. Every line should be thoughtful, every interface built for the user.',
        ru: 'Код — это искусство. Каждая строка должна быть продуманной, каждый интерфейс создан для пользователя.'
      },
      goals: {
        uz: 'Dunyo miqyosida tan olingan frontend dasturchi bo‘lish va ochiq kodli loyihalarga hissa qo‘shish.',
        en: 'Become a globally recognized frontend developer and contribute to open-source projects.',
        ru: 'Стать всемирно признанным фронтенд-разработчиком и вносить вклад в open-source проекты.'
      }
    };
  },

  // Projects
  getProjects() {
    const projects = this.get(this.KEYS.PROJECTS);
    if (projects && projects.length) return projects;
    return this.defaultProjects();
  },

  saveProjects(projects) {
    this.set(this.KEYS.PROJECTS, projects);
    this.logActivity('Projects updated');
  },

  defaultProjects() {
    return [
      {
        id: '1',
        title: 'BEHRUZ GAME',
        description: {
          uz: 'Interaktiv brauzer o‘yinlari platformasi. Zamonaviy dizayn va silliq animatsiyalar bilan yaratilgan.',
          en: 'Interactive browser games platform. Built with modern design and smooth animations.',
          ru: 'Платформа интерактивных браузерных игр. Создана с современным дизайном и плавными анимациями.'
        },
        category: 'Gaming',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        liveUrl: 'https://behruz-game.netlify.app/',
        githubUrl: '',
        image: null,
        featured: true
      },
      {
        id: '2',
        title: 'BEHRUZ DTM',
        description: {
          uz: 'DTM imtihonlariga tayyorgarlik platformasi. Testlar, natijalar va statistika.',
          en: 'DTM exam preparation platform. Tests, results and statistics.',
          ru: 'Платформа подготовки к экзаменам DTM. Тесты, результаты и статистика.'
        },
        category: 'Education',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        liveUrl: 'https://behruzdtm.netlify.app/',
        githubUrl: '',
        image: null,
        featured: true
      },
      {
        id: '3',
        title: 'HELPCENTR',
        description: {
          uz: 'Foydalanuvchilarga yordam markazi. Qo‘llanmalar, FAQ va qo‘llab-quvvatlash tizimi.',
          en: 'User help center. Guides, FAQ and support system.',
          ru: 'Центр помощи пользователям. Руководства, FAQ и система поддержки.'
        },
        category: 'Support',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        liveUrl: 'https://helpcentr.netlify.app/',
        githubUrl: '',
        image: null,
        featured: true
      },
      {
        id: '4',
        title: 'MAKER VIDEO',
        description: {
          uz: 'Video yaratish va tahrirlash vositasi. Kreativ kontent ishlab chiqarish uchun.',
          en: 'Video creation and editing tool. For producing creative content.',
          ru: 'Инструмент создания и редактирования видео. Для производства креативного контента.'
        },
        category: 'Creative / Video',
        technologies: ['HTML5', 'CSS3', 'JavaScript'],
        liveUrl: 'https://maker-video.netlify.app/',
        githubUrl: '',
        image: null,
        featured: true
      }
    ];
  },

  // Skills
  getSkills() {
    const skills = this.get(this.KEYS.SKILLS);
    if (skills && skills.length) return skills;
    return this.defaultSkills();
  },

  saveSkills(skills) {
    this.set(this.KEYS.SKILLS, skills);
    this.logActivity('Skills updated');
  },

  defaultSkills() {
    return [
      { id: '1', name: 'HTML5', percent: 90 },
      { id: '2', name: 'CSS3', percent: 88 },
      { id: '3', name: 'JavaScript', percent: 82 },
      { id: '4', name: 'Responsive Design', percent: 90 },
      { id: '5', name: 'UI/UX Design', percent: 78 },
      { id: '6', name: 'Git', percent: 75 },
      { id: '7', name: 'GitHub', percent: 80 },
      { id: '8', name: 'Web Development', percent: 85 }
    ];
  },

  // Messages
  getMessages() {
    return this.get(this.KEYS.MESSAGES) || [];
  },

  saveMessage(msg) {
    const messages = this.getMessages();
    messages.unshift({
      id: Date.now().toString(),
      ...msg,
      date: new Date().toISOString(),
      read: false
    });
    this.set(this.KEYS.MESSAGES, messages);
    this.logActivity('New contact message received');
  },

  markMessageRead(id) {
    const messages = this.getMessages();
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.read = true;
      this.set(this.KEYS.MESSAGES, messages);
    }
  },

  deleteMessage(id) {
    let messages = this.getMessages();
    messages = messages.filter(m => m.id !== id);
    this.set(this.KEYS.MESSAGES, messages);
    this.logActivity('Message deleted');
  },

  // Settings
  getSettings() {
    return this.get(this.KEYS.SETTINGS) || {
      siteName: 'BEHRUZ.DEV',
      tagline: 'Frontend Developer Portfolio',
      showStats: true,
      maintenance: false
    };
  },

  saveSettings(settings) {
    this.set(this.KEYS.SETTINGS, settings);
    this.logActivity('Settings updated');
  },

  // Activity
  logActivity(action) {
    const logs = this.get(this.KEYS.ACTIVITY) || [];
    logs.unshift({
      action,
      time: new Date().toISOString()
    });
    if (logs.length > 50) logs.pop();
    this.set(this.KEYS.ACTIVITY, logs);
  },

  getActivity() {
    return this.get(this.KEYS.ACTIVITY) || [];
  },

  // Language
  getLang() {
    return localStorage.getItem(this.KEYS.LANG) || 'uz';
  },

  setLang(lang) {
    localStorage.setItem(this.KEYS.LANG, lang);
  },

  // Auth (demo only — NOT for production)
  isAuthenticated() {
    return sessionStorage.getItem(this.KEYS.AUTH) === 'true';
  },

  login(username, password) {
    // DEMO ONLY credentials. In production use server-side auth + hashing.
    if (username === 'norsafarov' && password === 'behruzcr7') {
      sessionStorage.setItem(this.KEYS.AUTH, 'true');
      this.logActivity('Admin logged in');
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(this.KEYS.AUTH);
    this.logActivity('Admin logged out');
  }
};

// Initialize defaults on first load
(function initStorage() {
  if (!localStorage.getItem(Storage.KEYS.PROJECTS)) {
    Storage.saveProjects(Storage.defaultProjects());
  }
  if (!localStorage.getItem(Storage.KEYS.SKILLS)) {
    Storage.saveSkills(Storage.defaultSkills());
  }
  if (!localStorage.getItem(Storage.KEYS.PROFILE)) {
    Storage.saveProfile(Storage.defaultProfile());
  }
})();