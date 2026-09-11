"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import HireMeModal from "./components/HireMeModal";

const LINES = {
  top: "Hi — I'm Abdul's guide bot. Keep scrolling; the board moves with you.",
  work: "Two internships: AI engineering at DreamBridge.ai, WordPress at HolSol. Scraping, FastAPI, frontend.",
  projects:
    "LinguaSign is the one to look at — 38 PSL letters recognized live, then spoken back in Urdu.",
  skills:
    "Python and TensorFlow on one side, Next.js and FastAPI on the other. Full stack, both ends.",
  contact:
    "That's the tour. He's open to full-time AI, software, and data roles — say hello.",
};

const SECTION_IDS = ["top", "work", "projects", "skills", "contact"];

export default function Home() {
  const [section, setSection] = useState("top");
  const [scrolled, setScrolled] = useState(false);
  const [buddyOn, setBuddyOn] = useState(true);
  const [hireOpen, setHireOpen] = useState(false);

  useEffect(() => {
    function measure() {
      const vh = window.innerHeight || 800;
      const line = vh * 0.45;
      let current = "top";
      SECTION_IDS.forEach((id) => {
        const n = document.getElementById(id);
        if (!n) return;
        const r = n.getBoundingClientRect();
        if (r.top <= line) current = id;
      });
      const hero = document.getElementById("top");
      const isScrolled = hero
        ? hero.getBoundingClientRect().bottom < vh * 0.55
        : false;
      setSection((prev) => (prev !== current ? current : prev));
      setScrolled(isScrolled);
    }
    measure();
    window.addEventListener("scroll", measure, { passive: true, capture: true });
    window.addEventListener("resize", measure);
    const timer = setInterval(measure, 400);
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      clearInterval(timer);
    };
  }, []);

  const showBubble = buddyOn && scrolled;

  return (
    <>
      <Script src="/tech-scene.js" strategy="afterInteractive" />

      <div className="bg-scene">
        <tech-scene mode="world"></tech-scene>
      </div>
      <div className="bg-fade" />

      <div className="wrap">
        <nav>
          <a href="#top" className="logo mono">
            AW<span>.</span>
          </a>
          <div className="nav-links mono">
            <a href="#work">work</a>
            <a href="#projects">projects</a>
            <a href="#skills">skills</a>
            <a href="#contact">contact</a>
          </div>
          <button
            type="button"
            className="hire-btn mono"
            onClick={() => setHireOpen(true)}
          >
            Hire Me
          </button>
        </nav>

        <header id="top">
          <div className="hero-fade" />
          <div className="hero-inner">
            <div className="badge mono">
              <span className="badge-dot" />
              OPEN TO FULL-TIME ROLES
            </div>
            <h1 className="name">Abdul Wahid</h1>
            <p className="lede">
              Computer Science graduate majoring in Data Science. I build real-time
              computer-vision systems, FastAPI &amp; Next.js applications, and Python
              automation pipelines — owning features end-to-end from model logic to
              a deployed frontend.
            </p>
            <div className="cta-row">
              <a href="mailto:cs.abdulwahid@gmail.com" className="btn btn-primary mono">
                cs.abdulwahid@gmail.com
              </a>
              <a
                href="https://github.com/abdul-wahid-lab"
                className="btn btn-outline mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/abdul-wahid-1507221a7/"
                className="btn btn-outline mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a href="/Abdul_Wahid_CV.pdf" className="btn btn-outline mono" download>
                Resume
              </a>
            </div>
          </div>
        </header>

        <section className="stats">
          <div className="stat">
            <div className="stat-num">2</div>
            <div className="stat-label mono">ENGINEERING INTERNSHIPS</div>
          </div>
          <div className="stat">
            <div className="stat-num">2026</div>
            <div className="stat-label mono">BSCS, HITEC UNIVERSITY</div>
          </div>
        </section>

        <section id="work" className="sec">
          <div className="sec-head">
            <span className="sec-num mono">01</span>
            <h2 className="sec-title">Experience</h2>
          </div>

          <article className="job">
            <div>
              <div className="job-date mono">AUG 2025 — DEC 2025</div>
              <div className="job-org">DreamBridge.ai</div>
            </div>
            <div>
              <h3 className="job-title">Artificial Intelligence Engineer</h3>
              <ul className="job-list">
                <li>
                  Built FastAPI automation services that [FILL IN: e.g., reduced
                  manual processing time by X% / replaced X hours/week of manual work].
                </li>
                <li>
                  Engineered scraping pipelines (Selenium, BeautifulSoup) that sourced
                  and structured [FILL IN: volume/type of data, e.g., "10k+ product
                  listings"] for downstream AI workflows.
                </li>
                <li>
                  Shipped backend and frontend features across [FILL IN: X] internal
                  tools, [FILL IN: outcome, e.g., "cutting turnaround time on Y from
                  X to Y"].
                </li>
              </ul>
              <div className="tags mono">
                <span className="tag">FastAPI</span>
                <span className="tag">Selenium</span>
                <span className="tag">BeautifulSoup</span>
                <span className="tag">Python</span>
              </div>
            </div>
          </article>

          <article className="job">
            <div>
              <div className="job-date mono">JUL 2024 — SEP 2024</div>
              <div className="job-org">HolSol Technology</div>
            </div>
            <div>
              <h3 className="job-title">WordPress Developer, Intern</h3>
              <ul className="job-list">
                <li>
                  Built and customized WordPress websites and templates for client
                  and internal use.
                </li>
                <li>
                  Supported content, media, and plugin integrations, troubleshooting
                  theme compatibility and layout issues.
                </li>
              </ul>
            </div>
          </article>

          <article className="job">
            <div>
              <div className="job-date mono">VOLUNTEER</div>
              <div className="job-org">1,000-Mile Run Across Pakistan</div>
            </div>
            <div>
              <h3 className="job-title">Media Manager</h3>
              <ul className="job-list">
                <li>
                  Managed digital media content and online engagement for a
                  nationwide fundraising run supporting The Citizens Foundation.
                </li>
                <li>
                  Coordinated content delivery, scheduling, and outreach across a
                  multi-city, multi-week initiative.
                </li>
              </ul>
            </div>
          </article>
        </section>

        <section id="projects" className="sec">
          <div className="sec-head">
            <span className="sec-num mono">02</span>
            <h2 className="sec-title">Selected Projects</h2>
          </div>

          <article className="project-feature">
            <div className="shot">
              <img
                src="/linguasign-home.png"
                alt="LinguaSign landing page"
              />
            </div>
            <div className="project-feature-body">
              <div>
                <div className="eyebrow mono">FINAL YEAR PROJECT</div>
                <h3 className="project-title">
                  LinguaSign — Pakistan Sign Language Detection
                </h3>
                <a
                  href="https://github.com/abdul-wahid-lab/fyp-project-Pakistan-sign-language-detection-system"
                  className="repo-link mono"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View repository →
                </a>
              </div>
              <div>
                <p className="project-desc">
                  Real-time hand-gesture recognition translating 38 PSL alphabet
                  letters into Urdu text and speech from webcam input, using
                  MediaPipe hand-landmark detection and a TensorFlow model. Includes
                  a live Urdu sentence builder with integrated speech synthesis —
                  achieving [FILL IN: X]% accuracy across 38 PSL letters at
                  [FILL IN: X] FPS on live webcam input, trained on [FILL IN: X]
                  labeled samples.
                </p>
                <div className="tags mono">
                  <span className="tag">TensorFlow</span>
                  <span className="tag">MediaPipe</span>
                  <span className="tag">OpenCV</span>
                  <span className="tag">FastAPI</span>
                  <span className="tag">Next.js</span>
                  <span className="tag">TypeScript</span>
                </div>
              </div>
            </div>
          </article>

          <div className="project-grid">
            <article className="project-card">
              <div className="shot-sm">
                <img src="/3d-portfolio.png" alt="3D Developer Portfolio hero section" />
              </div>
              <h3>3D Developer Portfolio</h3>
              <p>
                Interactive React/Three.js portfolio with EmailJS contact delivery,
                deployed on Vercel — [FILL IN: e.g., "X interactive 3D scenes",
                a Lighthouse performance score, or load time].
              </p>
              <div className="tags mono">
                <span className="tag">Three.js</span>
                <span className="tag">Vite</span>
              </div>
              <a
                href="https://github.com/abdul-wahid-lab/portfolio"
                className="repo-link mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                View repository →
              </a>
            </article>

            <article className="project-card">
              <div className="shot-sm diagram">
                <img src="/tumor-detection.png" alt="Tumor detection pipeline: preprocessing, segmentation, feature extraction, and classification" />
              </div>
              <h3>Tumor Detection System</h3>
              <p>
                Skin lesion image classification pipeline — segmentation, CNN feature
                extraction, and ANN classification to flag likely tumors, achieving
                [FILL IN: X]% classification accuracy on [FILL IN: X] lesion images.
              </p>
              <div className="tags mono">
                <span className="tag">scikit-learn</span>
                <span className="tag">TensorFlow</span>
                <span className="tag">Python</span>
              </div>
              <a
                href="https://github.com/abdul-wahid-lab/tumor-detection-system"
                className="repo-link mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                View repository →
              </a>
            </article>

            <article className="project-card">
              <div className="shot-sm">
                <img src="/git-command-reference.png" alt="Git Command Reference tool interface" />
              </div>
              <h3>Git Command Reference</h3>
              <p>
                Single-file reference for ~213 Git/GitHub commands with live search
                and per-command detail panels.
              </p>
              <div className="tags mono">
                <span className="tag">HTML</span>
                <span className="tag">JavaScript</span>
              </div>
              <a
                href="https://github.com/abdul-wahid-lab/git-command-reference"
                className="repo-link mono"
                target="_blank"
                rel="noopener noreferrer"
              >
                View repository →
              </a>
            </article>
          </div>
        </section>

        <section id="skills" className="sec">
          <div className="sec-head">
            <span className="sec-num mono">03</span>
            <h2 className="sec-title">Technical Skills</h2>
          </div>
          <div className="skills-grid">
            <div className="skill-cat">
              <div className="skill-cat-label mono">LANGUAGES</div>
              <p>Python · TypeScript · JavaScript · C++ · HTML · CSS · ASM x86</p>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-label mono">AI / ML</div>
              <p>TensorFlow · scikit-learn · MediaPipe · OpenCV · NumPy · Pandas</p>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-label mono">WEB DEVELOPMENT</div>
              <p>FastAPI · Next.js · React · Tailwind CSS · WordPress</p>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-label mono">DATA &amp; AUTOMATION</div>
              <p>Scraping &amp; preprocessing · Selenium · BeautifulSoup · ADB</p>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-label mono">DATABASES &amp; CLOUD</div>
              <p>PostgreSQL · MySQL · MongoDB · SQL · GCP · AWS</p>
            </div>
            <div className="skill-cat">
              <div className="skill-cat-label mono">TOOLS</div>
              <p>Git · GitHub · VS Code · Postman · Arduino Uno</p>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="contact-grid">
            <div>
              <h2 className="contact-heading">Let&apos;s build something.</h2>
              <p className="contact-sub">
                Currently seeking full-time roles in AI, software development, or
                data science. Based in Pakistan, open to remote.
              </p>
            </div>
            <div className="contact-list mono">
              <a href="mailto:cs.abdulwahid@gmail.com" className="contact-row">
                <span>EMAIL</span>
                <span>cs.abdulwahid@gmail.com</span>
              </a>
              <a href="tel:+923135254905" className="contact-row">
                <span>PHONE</span>
                <span>+92 313 5254905</span>
              </a>
              <a
                href="https://github.com/abdul-wahid-lab"
                className="contact-row"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>GITHUB</span>
                <span>/abdul-wahid-lab</span>
              </a>
              <a
                href="https://www.linkedin.com/in/abdul-wahid-1507221a7/"
                className="contact-row"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>LINKEDIN</span>
                <span>/in/abdul-wahid-1507221a7</span>
              </a>
            </div>
          </div>
          <div className="footer-note mono">
            © 2026 ABDUL WAHID — BSCS, DATA SCIENCE, HITEC UNIVERSITY
          </div>
        </section>
      </div>

      <div
        className="buddy-wrap"
        style={{
          display: buddyOn ? "flex" : "none",
          opacity: section === "contact" ? 0.25 : 1,
        }}
      >
        <div
          className={`bubble${showBubble ? " show" : ""}`}
          style={{ pointerEvents: section === "contact" ? "none" : "auto" }}
        >
          <div className="bubble-label mono">UNIT-AW · GUIDE</div>
          <div className="bubble-text">{LINES[section] || LINES.top}</div>
          <button
            className="bubble-close"
            aria-label="Hide guide"
            onClick={() => setBuddyOn(false)}
          >
            ×
          </button>
        </div>
        <div className="buddy-stage">
          <tech-scene mode="buddy"></tech-scene>
        </div>
      </div>

      {hireOpen && <HireMeModal onClose={() => setHireOpen(false)} />}
    </>
  );
}
