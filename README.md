# BEHRUZ.DEV — Professional Cyber Hacker Developer Portfolio

**Project №02** | Personal Developer Portfolio  
**Owner:** Behruz Norsafarov  
**Design:** Cyber Hacker / Futuristic  
**Stack:** HTML5 · CSS3 · Vanilla JavaScript  

---

## Overview

Premium, fully functional personal portfolio website with:

- Dark cyber aesthetic (`#050807` + neon green `#00FF88`)
- Matrix background + animated grid
- Custom cursor
- Glassmorphism cards
- Multilingual (Oʻzbek / English / Русский)
- Admin panel with full CRUD
- LocalStorage persistence (demo)
- Responsive design
- SEO meta tags
- Smooth animations & scroll reveal

---

## Project Structure

```
behruz-portfolio/
├── index.html              # Home
├── about.html              # About
├── projects.html           # Projects
├── skills.html             # Skills
├── contact.html            # Contact
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── projects.html
│   ├── profile.html
│   ├── skills.html
│   ├── messages.html
│   └── settings.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── animations.css
│   └── admin.css
├── js/
│   ├── main.js
│   ├── translations.js
│   ├── projects.js
│   ├── skills.js
│   ├── contact.js
│   ├── storage.js
│   └── admin.js
├── assets/
│   ├── images/
│   │   └── projects/
│   ├── icons/
│   └── cv/
└── README.md
```

---

## Getting Started (Local)

1. Clone or download the project folder.
2. Open the folder in any static server, or simply open `index.html` in a modern browser.

**Recommended (Live Server / VS Code):**
```bash
# Using Python
cd behruz-portfolio
python -m http.server 8080

# Or using npx
npx serve .
```

Then open: `http://localhost:8080`

---

## Admin Panel

**URL:** `/admin/login.html`

**Demo credentials (local only):**
- Username: `norsafarov`
- Password: `behruzcr7`

### Admin Features
| Feature              | Description                                      |
|----------------------|--------------------------------------------------|
| Dashboard            | Stats + activity log                             |
| Projects CRUD        | Add / edit / delete projects + image upload      |
| Profile Editor       | Name, bio, about, social links, photo, CV        |
| Skills CRUD          | Name + progress percentage                       |
| Messages             | View / mark read / delete contact form messages  |
| Settings             | Site name, tagline, options                      |

> **Security warning:** Credentials are checked in frontend JavaScript for demo only.  
> For production you **must** implement server-side authentication, password hashing, and secure sessions. Never leave plaintext credentials in client code.

---

## Multilingual System

Three languages supported via `js/translations.js` + `localStorage`:

- **UZ** — Oʻzbek
- **EN** — English  
- **RU** — Русский

Language preference is saved and applied across all pages.  
Project descriptions, about text, and profile content also support per-language values stored in LocalStorage.

---

## Contact Form

In demo mode messages are saved to `localStorage` and appear in the Admin → Messages section.

For production, integrate one of:
- [Formspree](https://formspree.io)
- [EmailJS](https://www.emailjs.com)
- Your own backend API

---

## Netlify Deployment

1. Push the `behruz-portfolio` folder to a GitHub repository.
2. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Select the repository.
4. Build settings:
   - **Publish directory:** `/` (or leave empty if root is the site)
   - No build command needed (static site).
5. Deploy.

Optional: add a `netlify.toml`:
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Custom domain: connect `behruz.dev` (or any domain) in Netlify Domain settings.

---

## Customization Guide

### Change profile photo
1. Log in to Admin → Profile
2. Upload image → Save

### Add / edit projects
Admin → Projects → Add / Edit

### Update skills percentages
Admin → Skills

### Change social links & bio
Admin → Profile

### CV
Admin → Profile → CV Upload (PDF).  
Then the “Download CV” button on the homepage will work.

---

## Browser Support

- Chrome / Edge / Firefox / Safari (latest)
- Mobile responsive (iOS / Android)

---

## Notes

- All data is stored in the browser’s `localStorage`. Clearing site data will reset content to defaults.
- Custom cursor is disabled on touch devices.
- Matrix canvas may impact performance on very low-end devices; it can be removed by deleting the `<canvas class="matrix-bg">` element.

---

## License

Personal project of Behruz Norsafarov.  
Feel free to use the structure as a learning reference.

---

**BEHRUZ.DEV** — Built with focus on craft and detail.  
© 2026 Behruz Norsafarov
