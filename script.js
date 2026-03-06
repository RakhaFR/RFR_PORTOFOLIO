/***********************************
 =====   Active navbar (scroll) ====
 ***********************************/
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".navbar a");

function setActiveLink() {
  const scrollY = window.scrollY;
  sections.forEach((section) => {
    const sectionTop    = section.offsetTop - 130;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((l) => l.classList.remove("active"));
      const activeLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveLink, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

/***********************************
 =====  Auto-close mobile nav  =====
 ***********************************/
const check = document.getElementById("check");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (check) check.checked = false;
  });
});

/***********************************
 =====   Popup image gallery   =====
 ***********************************/
const popup    = document.getElementById("popupGallery");
const btnMore  = document.querySelector(".btn-more");
const btnClose = document.querySelector(".popup-gallery .close");

const selectCategory = document.querySelector(".gallery-thumbs select");
const thumbs         = document.querySelectorAll(".thumb-grid .thumb");

if (selectCategory) {
  selectCategory.addEventListener("change", () => {
    const category = selectCategory.value.toLowerCase();
    thumbs.forEach((thumb) => {
      const thumbCategory = thumb.getAttribute("data-category");
      const show =
        category === "all" || category === "category..." || category === ""
          ? true
          : thumbCategory === category;
      thumb.style.display = show ? "block" : "none";
    });
  });
}

if (btnMore)  btnMore.addEventListener("click",  () => { popup.style.display = "block"; });
if (btnClose) btnClose.addEventListener("click", () => { popup.style.display = "none";  });

window.addEventListener("click", (e) => {
  if (e.target === popup) popup.style.display = "none";
});

/***********************************
 =====   PARALLAX EFFECTS       =====
 ***********************************/

/* ── 1. Orb / blob parallax on mousemove (hero) ── */
const homeSection = document.querySelector(".home-content");
const blobFrame   = document.querySelector(".margin-top .blob-frame");

if (homeSection && blobFrame) {
  homeSection.addEventListener("mousemove", (e) => {
    const rect = homeSection.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;  // -1 → +1
    const dy   = (e.clientY - rect.top  - cy) / cy;

    // subtle tilt on the blob
    blobFrame.style.transform = `translate(${dx * 14}px, ${dy * 10}px)`;
  });

  homeSection.addEventListener("mouseleave", () => {
    blobFrame.style.transform = "translate(0, 0)";
    blobFrame.style.transition = "transform 0.6s ease";
  });

  homeSection.addEventListener("mouseenter", () => {
    blobFrame.style.transition = "transform 0.15s ease";
  });
}

/* ── 2. Scroll-based vertical parallax for sections ── */
const parallaxMap = [
  { selector: ".home-content::before", speed: 0.3 },  // grid layer handled via CSS
  { selector: ".about::before",        speed: 0.2 },
];

// Inject floating orbs into major sections
function injectParallaxOrbs() {
  const orbConfig = [
    { parent: ".home-content",  top: "15%",  left: "60%",  size: 400, color: "0,200,255",  opacity: 0.12 },
    { parent: ".home-content",  top: "60%",  left: "80%",  size: 250, color: "0,255,200",  opacity: 0.07 },
    { parent: ".about",         top: "10%",  left: "-10%", size: 450, color: "0,200,255",  opacity: 0.08 },
    { parent: ".gallery",       top: "30%",  left: "70%",  size: 350, color: "0,255,200",  opacity: 0.07 },
    { parent: ".skill",         top: "50%",  left: "-5%",  size: 380, color: "0,200,255",  opacity: 0.08 },
    { parent: ".projek",        top: "20%",  left: "75%",  size: 320, color: "0,255,200",  opacity: 0.07 },
  ];

  orbConfig.forEach(({ parent, top, left, size, color, opacity }) => {
    const section = document.querySelector(parent);
    if (!section) return;
    section.style.position = "relative";
    section.style.overflow  = "hidden";

    const orb = document.createElement("div");
    orb.className = "parallax-orb";
    orb.style.cssText = `
      top:${top}; left:${left};
      width:${size}px; height:${size}px;
      background: radial-gradient(circle, rgba(${color},${opacity}) 0%, transparent 65%);
      pointer-events:none;
      position:absolute;
      border-radius:50%;
      filter:blur(70px);
      will-change:transform;
      z-index:0;
    `;
    orb.dataset.speed = (Math.random() * 0.12 + 0.06).toFixed(3);
    section.insertBefore(orb, section.firstChild);
  });
}

injectParallaxOrbs();

/* ── 3. RAF scroll parallax for orbs ── */
let ticking  = false;
let lastScrollY = 0;

function updateParallax() {
  const sy = window.scrollY;

  document.querySelectorAll(".parallax-orb").forEach((orb) => {
    const speed  = parseFloat(orb.dataset.speed || 0.1);
    const parent = orb.closest("section") || orb.parentElement;
    if (!parent) return;

    const rect   = parent.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (window.innerHeight / 2 - center) * speed;

    orb.style.transform = `translateY(${offset}px)`;
  });

  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

/* ── 4. Section text parallax (subtle) ── */
const parallaxTexts = document.querySelectorAll(".content h1, .sub-main h2");

function updateTextParallax() {
  parallaxTexts.forEach((el) => {
    const rect   = el.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const dist   = rect.top + rect.height / 2 - center;
    el.style.transform = `translateY(${dist * 0.04}px)`;
  });
}

window.addEventListener("scroll", () => {
  requestAnimationFrame(updateTextParallax);
}, { passive: true });

/* ── 5. Skill bars animate when in viewport ── */
const skillBars = document.querySelectorAll(".skill-card .bar span");

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.style.width; // already set inline
        bar.style.width = "0%";
        requestAnimationFrame(() => {
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 100);
        });
        barObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

skillBars.forEach((bar) => barObserver.observe(bar));

/* ── 6. Header shrink on scroll ── */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.style.padding = "1rem 8%";
  } else {
    header.style.padding = "1.6rem 8%";
  }
}, { passive: true });

/* ── 7. Card tilt on hover (3D micro-interaction) ── */
document.querySelectorAll(".card, .skill-card, .contact-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;

    card.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-10px)`;
    card.style.transition = "transform 0.1s ease";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform  = "";
    card.style.transition = "transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease";
  });
});

/* ── 8. Entrance animation for section headings ── */
const headingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = "1";
        entry.target.style.transform  = "translateY(0)";
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".heading").forEach((h) => {
  h.style.opacity   = "0";
  h.style.transform = "translateY(30px)";
  h.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  headingObserver.observe(h);
});