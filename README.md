# Abdul Wahid — Portfolio

Personal portfolio site — Next.js (App Router), a scroll-reactive three.js
background, live GitHub stats, and a working "Hire Me" contact form.

**Live:** [portfolio-pi-sand-64.vercel.app](https://portfolio-pi-sand-64.vercel.app)

---

## Features

- Dark, minimal single-page layout — experience, projects, skills, contact
- Animated 3D circuit-board background + cursor-tracking robot guide (custom `<tech-scene>` web component, three.js)
- Live public-repo count pulled from the GitHub API on page load
- "Hire Me" modal with a real contact form, wired to EmailJS
- Mobile-first responsive layout

## Tech Stack

| Layer      | Technology                          |
| ---------- | ------------------------------------ |
| Framework  | Next.js 16 (App Router), React 19    |
| Styling    | Plain CSS (`app/globals.css`)        |
| 3D         | three.js (loaded via a custom `tech-scene` web component) |
| Email      | EmailJS (`@emailjs/browser`)         |
| Deployment | Vercel                               |

## Project Structure

```
portfolio/
├── app/
│   ├── components/
│   │   └── HireMeModal.js     # Contact form modal (EmailJS)
│   ├── favicon.ico
│   ├── globals.css            # All site styling
│   ├── layout.js              # Root layout, metadata, fonts
│   └── page.js                # The entire single-page site
├── public/
│   ├── tech-scene.js          # 3D background + robot guide (custom element)
│   ├── Abdul_Wahid_CV.pdf     # Resume, linked from the hero section
│   └── *.png                  # Project screenshots
├── next.config.mjs
├── package.json
└── .env.local                 # EmailJS credentials (git-ignored, not in repo)
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` in the project root with your EmailJS credentials
(used by the Hire Me contact form):

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Get these from a free account at [emailjs.com](https://www.emailjs.com/).

### Build for production

```bash
npm run build
npm run start
```

## Deployment

Deployed on [Vercel](https://vercel.com), connected to this repository for
automatic deploys on push to `master`. The EmailJS environment variables
above are set in the Vercel project settings (Production + Preview).
