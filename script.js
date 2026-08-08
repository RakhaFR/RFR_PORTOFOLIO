/***********************************
 =====   PAGE LOADER / LAZY LOAD ===
 ***********************************/
(function () {
  const loader  = document.getElementById("page-loader");
  const bar     = document.getElementById("loaderBar");
  const percent = document.getElementById("loaderPercent");

  document.body.classList.add("loading");

  function setProgress(p) {
    const v = Math.min(Math.round(p), 100);
    if (bar)     bar.style.width = v + "%";
    if (percent) percent.textContent = v + "%";
  }

  function hideLoader() {
    setProgress(100);
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.classList.remove("loading");
    }, 600);
  }

  function lazyLoadImages() {
    const imgs = Array.from(document.querySelectorAll("img[src]")).filter(
      (img) => !img.closest("#page-loader") && !img.hasAttribute("data-eager")
    );

    if (imgs.length === 0) { hideLoader(); return; }

    let loaded = 0;
    let fakeProgress = 5;

    const fakeInterval = setInterval(() => {
      if (fakeProgress < 30) {
        fakeProgress += 3;
        setProgress(fakeProgress);
      } else {
        clearInterval(fakeInterval);
      }
    }, 120);

    imgs.forEach((img) => {
      const realSrc = img.getAttribute("src");
      img.setAttribute("data-src", realSrc);
      img.removeAttribute("src");

      const tempImg = new Image();
      tempImg.onload = tempImg.onerror = () => {
        loaded++;
        img.setAttribute("src", realSrc);
        const progress = 30 + (loaded / imgs.length) * 70;
        setProgress(progress);
        if (loaded === imgs.length) {
          clearInterval(fakeInterval);
          hideLoader();
        }
      };
      tempImg.src = realSrc;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lazyLoadImages);
  } else {
    lazyLoadImages();
  }

  setTimeout(hideLoader, 6000);
})();

/***********************************
 =====   Active navbar (scroll) ====
 ***********************************/
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");

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
      const thumbCategory = (thumb.getAttribute("data-category") || "").toLowerCase();
      const show =
        category === "all" || category === ""
          ? true
          : thumbCategory === category;

      if (show) {
        thumb.style.display = "block";
        // Reset AOS state supaya animasi bisa re-trigger
        thumb.removeAttribute("data-aos-id");
        thumb.classList.remove("aos-animate", "aos-init");
      } else {
        thumb.style.display = "none";
      }
    });

    // Refresh AOS setelah DOM selesai diupdate
    requestAnimationFrame(() => {
      if (typeof AOS !== "undefined") {
        AOS.refreshHard();
        // Force-animate elemen yang sudah ada di dalam viewport sekarang
        thumbs.forEach((thumb) => {
          if (thumb.style.display === "none") return;
          const rect = thumb.getBoundingClientRect();
          const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
          if (inViewport) {
            thumb.classList.add("aos-init", "aos-animate");
          }
        });
      }
    });
  });
}

if (btnMore)  btnMore.addEventListener("click",  () => { popup.style.display = "block"; });
if (btnClose) btnClose.addEventListener("click", () => { popup.style.display = "none";  });

window.addEventListener("click", (e) => {
  if (e.target === popup) popup.style.display = "none";
});

/*************************************
 =====  HORIZONTAL PARALLAX SCROLL ===
 *************************************/
/*
  MANUAL PINNING (tanpa CSS sticky, karena overflow-x:hidden merusaknya).

  Tiga state:
  1. BEFORE  → inner relative, belum di-pin
  2. PINNED  → inner fixed top:0, layar "ditahan", track translateX
  3. PAST    → inner absolute bottom wrap, scroll lanjut ke bawah

  Pin zone: scrollY antara wrapTop dan wrapTop + maxShift
  maxShift = track.scrollWidth - viewportWidth (+ sedikit padding)
  wrap.height = 100vh + maxShift
*/
(function initHScroll() {
  const wrap  = document.getElementById("hscrollWrap");
  const inner = wrap && wrap.querySelector(".hscroll-inner");
  const track = wrap && document.getElementById("hscrollTrack");
  if (!wrap || !inner || !track) return;

  let maxShift = 0;
  let rafId    = null;

  /* ── Debounce helper ── */
  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  /* ── 1. Hitung maxShift & set wrapper height ── */
  function recalc() {
    // Sementara reset inner ke relative agar offsetTop wrap akurat
    inner.classList.remove("pinned", "past");
    inner.style.top = "";
    track.style.transform = "translateX(0px)";

    const vw     = window.innerWidth;
    const vh     = window.innerHeight;
    const trackW = track.scrollWidth;

    // maxShift: geser sampai kata terakhir bisa masuk tengah viewport.
    // +vw*0.5 karena focusX ada di tengah, jadi track perlu geser lebih jauh
    // supaya kata terakhir (yang tadinya di kanan) bisa sampai ke posisi tengah.
    maxShift = Math.max(0, trackW - vw + vw * 0.5);

    // Wrap height = 1 viewport + jarak scroll horizontal
    wrap.style.height = (vh + maxShift) + "px";
  }

  /* ── 2. Update setiap frame ── */
  function update() {
    rafId = null;

    const scrollY = window.scrollY;

    // Hitung wrapTop SETIAP FRAME — karena lazy-load bisa geser layout
    // Kita pakai wrap.getBoundingClientRect().top + scrollY untuk dapat
    // posisi absolut wrap dari document top
    const wrapRect = wrap.getBoundingClientRect();
    const wrapAbsTop = wrapRect.top + scrollY;

    const pinStart = wrapAbsTop;               // mulai pin
    const pinEnd   = wrapAbsTop + maxShift;     // selesai pin

    let scrolled = 0;

    if (scrollY < pinStart) {
      // ── BEFORE: belum sampai wrap ──
      inner.classList.remove("pinned", "past");
      inner.style.top = "";
      scrolled = 0;

    } else if (scrollY >= pinStart && scrollY <= pinEnd) {
      // ── PINNED: layar ditahan, track geser horizontal ──
      inner.classList.add("pinned");
      inner.classList.remove("past");
      inner.style.top = "0";
      scrolled = scrollY - pinStart;

    } else {
      // ── PAST: semua kata sudah lewat, lanjut scroll ke bawah ──
      inner.classList.remove("pinned");
      inner.classList.add("past");
      inner.style.top = maxShift + "px";
      scrolled = maxShift;
    }

    // Clamp untuk safety
    scrolled = Math.max(0, Math.min(maxShift, scrolled));

    const progress = maxShift > 0 ? scrolled / maxShift : 0;

    // Geser track horizontal
    track.style.transform = `translateX(-${scrolled}px)`;

    // Progress bar
    inner.style.setProperty("--hscroll-progress", (progress * 100).toFixed(2) + "%");

    // Highlight kata paling dekat ke TENGAH viewport
    const focusX = window.innerWidth * 0.5;
    const words  = track.querySelectorAll(".hscroll-word, .hscroll-sep");
    let   best   = null;
    let   bestD  = Infinity;

    words.forEach((el) => {
      const r    = el.getBoundingClientRect();
      const midX = r.left + r.width / 2;
      const d    = Math.abs(midX - focusX);
      if (d < bestD) { bestD = d; best = el; }
    });

    words.forEach((el) => el.classList.remove("active-word"));
    if (best) best.classList.add("active-word");
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  function init() {
    recalc();
    update();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", debounce(() => { init(); }, 150));

  /* ── Tunggu font Fraunces load agar scrollWidth akurat ── */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      init();
      // Safety net: recalc lagi setelah lazy-load images selesai
      setTimeout(init, 500);
      setTimeout(init, 1500);
    });
  } else {
    setTimeout(init, 800);
  }

  /* ── Recalc otomatis saat body berubah tinggi (lazy images dll) ── */
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(debounce(init, 250));
    ro.observe(document.body);
  }
})();

/***********************************
 =====   PARALLAX EFFECTS       =====
 ***********************************/

/* ── 1. Blob parallax on mousemove (hero) ── */
const homeSection = document.querySelector(".home-content");
const blobFrame   = document.querySelector(".margin-top .blob-frame");

if (homeSection && blobFrame) {
  homeSection.addEventListener("mousemove", (e) => {
    const rect = homeSection.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;
    blobFrame.style.transform = `translate(${dx * 14}px, ${dy * 10}px)`;
  });
  homeSection.addEventListener("mouseleave", () => {
    blobFrame.style.transform  = "translate(0, 0)";
    blobFrame.style.transition = "transform 0.6s ease";
  });
  homeSection.addEventListener("mouseenter", () => {
    blobFrame.style.transition = "transform 0.15s ease";
  });
}

/* ── 2. Inject floating lime orbs ── */
function injectParallaxOrbs() {
  const orbConfig = [
    { parent: ".home-content",  top: "15%",  left: "60%",  size: 400, color: "186,255,79",  opacity: 0.08 },
    { parent: ".home-content",  top: "60%",  left: "80%",  size: 250, color: "186,255,79",  opacity: 0.05 },
    { parent: ".about",         top: "10%",  left: "-10%", size: 450, color: "186,255,79",  opacity: 0.06 },
    { parent: ".gallery",       top: "30%",  left: "70%",  size: 350, color: "186,255,79",  opacity: 0.05 },
    { parent: ".skill",         top: "50%",  left: "-5%",  size: 380, color: "186,255,79",  opacity: 0.06 },
    { parent: ".projek",        top: "20%",  left: "75%",  size: 320, color: "186,255,79",  opacity: 0.05 },
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
      pointer-events:none; position:absolute; border-radius:50%;
      filter:blur(70px); will-change:transform; z-index:0;
    `;
    orb.dataset.speed = (Math.random() * 0.12 + 0.06).toFixed(3);
    section.insertBefore(orb, section.firstChild);
  });
}

injectParallaxOrbs();

/* ── 3. RAF scroll parallax for orbs ── */
let ticking = false;

function updateParallax() {
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
  if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
}, { passive: true });

/* ── 4. Section text parallax ── */
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
        const targetWidth = bar.style.width;
        bar.style.width = "0%";
        requestAnimationFrame(() => {
          setTimeout(() => { bar.style.width = targetWidth; }, 100);
        });
        barObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.4 }
);

skillBars.forEach((bar) => barObserver.observe(bar));

/* ── 6. Header scrolled class ── */
const header = document.querySelector(".header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}, { passive: true });

/* ── 7. Card 3D tilt on hover ── */
document.querySelectorAll(".card, .skill-card, .contact-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;
    card.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-6px)`;
    card.style.transition = "transform 0.1s ease";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform  = "";
    card.style.transition = "transform 0.5s ease, box-shadow 0.4s ease";
  });
});

/* ── 8. Entrance animation for headings ── */
const headingObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".heading").forEach((h) => {
  h.style.opacity    = "0";
  h.style.transform  = "translateY(30px)";
  h.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  headingObserver.observe(h);
});

/* ── 9. Three.js Interactive 3D Background ── */
(function initThreeJS() {
  const container = document.getElementById("hero-3d-container");
  if (!container) return;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const particlesCount = 1200;
  const geometry  = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const colors    = new Float32Array(particlesCount * 3);

  // ── WARNA DIUBAH: lime (#BAFF4F) + putih ──
  const color1 = new THREE.Color('#BAFF4F');  // lime
  const color2 = new THREE.Color('#ffffff');  // white

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * 12;
    positions[i + 1] = (Math.random() - 0.5) * 12;
    positions[i + 2] = (Math.random() - 0.5) * 12;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i]     = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width  = 16;
    canvas.height = 16;
    const ctx  = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
  };

  const material = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    map: createCircleTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  const windowHalfX = window.innerWidth  / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.001;
    mouseY = (e.clientY - windowHalfY) * 0.001;
  });

  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    points.rotation.y = t * 0.05;
    points.rotation.x = t * 0.02;
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    points.rotation.y += targetX * 0.5;
    points.rotation.x += targetY * 0.5;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();

/* ── 10. Hero scroll parallax ── */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  const heroText  = document.querySelector(".home-content .content");
  const heroImage = document.querySelector(".home-content .blob-frame");
  if (heroText  && window.innerWidth > 768) heroText.style.transform  = `translateY(${scrollY * 0.15}px)`;
  if (heroImage && window.innerWidth > 768) heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;

  const aboutSection = document.querySelector(".about");
  const aboutTitle   = document.querySelector(".sub-main h2");
  if (aboutSection && aboutTitle) {
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const offset = (window.innerHeight - rect.top) * 0.05;
      aboutTitle.style.transform = `translateY(${offset}px)`;
    }
  }
}, { passive: true });

/* ── 11. Firebase Real-Time Chat Room ── */
(function initFirebaseChat() {
  const checkFirebase = setInterval(() => {
    if (window.auth && window.db) {
      clearInterval(checkFirebase);
      setupChatApp();
    }
  }, 100);

  function setupChatApp() {
    const chatHeaderUserInfo  = document.getElementById("chat-header-user-info");
    const chatHeaderGuestInfo = document.getElementById("chat-header-guest-info");
    const btnLoginGoogle      = document.getElementById("btn-login-google");
    const btnLogout           = document.getElementById("btn-logout");
    const btnSendMessage      = document.getElementById("btn-send-message");
    const chatInputWrapper    = document.getElementById("chat-input-wrapper");
    const chatInputBlocked    = document.getElementById("chat-input-blocked");
    const chatUserPhoto       = document.getElementById("chat-user-photo");
    const chatUserName        = document.getElementById("chat-user-name");
    const chatMessages        = document.getElementById("chat-messages");
    const chatForm            = document.getElementById("chat-form");
    const chatInputText       = document.getElementById("chat-input-text");
    const chatCharCounter     = document.getElementById("chat-char-counter");

    let unsubscribeChat = null;
    let currentUser     = null;
    let lastSentTime    = 0;
    const cooldownMs    = 2000;

    // ─── A. Auth state ───
    window.auth.onAuthStateChanged((user) => {
      currentUser = user;
      if (user) {
        chatUserName.textContent = user.displayName || "Anonymous";
        chatUserPhoto.src        = user.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=guest";

        chatHeaderGuestInfo.style.display = "none";
        chatHeaderUserInfo.style.display  = "flex";
        btnLoginGoogle.style.display      = "none";
        btnLogout.style.display           = "flex";
        chatInputBlocked.style.display    = "none";
        chatInputWrapper.style.display    = "flex";
        chatInputText.disabled            = false;
        btnSendMessage.disabled           = false;

        chatMessages.innerHTML = '';
        startChatStream();
      } else {
        chatUserName.textContent = "Loading...";
        chatUserPhoto.src        = "";

        chatHeaderUserInfo.style.display  = "none";
        chatHeaderGuestInfo.style.display = "flex";
        btnLogout.style.display           = "none";
        btnLoginGoogle.style.display      = "inline-flex";
        chatInputWrapper.style.display    = "none";
        chatInputBlocked.style.display    = "flex";
        chatInputText.disabled            = true;
        btnSendMessage.disabled           = true;

        if (unsubscribeChat) { unsubscribeChat(); unsubscribeChat = null; }
        renderFakeChats();
      }
    });

    // ─── B. Auth actions ───
    btnLoginGoogle.addEventListener("click", async () => {
      try {
        await window.auth.signInWithPopup(window.googleProvider);
      } catch (err) {
        console.error("Login gagal:", err);
        alert("Gagal login dengan Google. Harap coba lagi.");
      }
    });

    btnLogout.addEventListener("click", async () => {
      try { await window.auth.signOut(); }
      catch (err) { console.error("Logout gagal:", err); }
    });

    // ─── C. Char counter ───
    chatInputText.addEventListener("input", () => {
      const len = chatInputText.value.length;
      chatCharCounter.textContent = `${len} / 200`;
      chatCharCounter.classList.toggle("limit-warn", len >= 180);
    });

    // ─── D. Real-time chat stream ───
    function startChatStream() {
      if (unsubscribeChat) unsubscribeChat();

      chatMessages.innerHTML = `
        <div id="chat-messages-loader" class="chat-loader">
          <div class="spinner"></div>
          <p>Memuat pesan...</p>
        </div>`;

      unsubscribeChat = window.db.collection("chats")
        .orderBy("timestamp", "asc")
        .limitToLast(50)
        .onSnapshot((snapshot) => {
          const loader = document.getElementById("chat-messages-loader");
          if (loader) loader.remove();

          if (snapshot.empty) {
            chatMessages.innerHTML = `
              <div class="chat-empty">
                <i class='bx bx-message-rounded-x'></i>
                <p>Belum ada pesan. Jadilah yang pertama mengirim pesan!</p>
              </div>`;
            return;
          }

          const emptyState = chatMessages.querySelector(".chat-empty");
          if (emptyState) emptyState.remove();

          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data      = change.doc.data();
              const messageId = change.doc.id;
              if (document.getElementById(`msg-${messageId}`)) return;
              renderMessage(messageId, data);
            }
          });

          scrollToBottom();
        }, (error) => {
          console.error("Chat error:", error);
          chatMessages.innerHTML = `
            <div class="chat-empty">
              <i class='bx bx-error' style='color:#ea4335;'></i>
              <p style='color:#ea4335;'>Gagal memuat pesan. Pastikan Rules Firestore sudah disiapkan.</p>
            </div>`;
        });
    }

    // ─── D2. Fake chats (guest mode) ───
    function renderFakeChats() {
      if (unsubscribeChat) { unsubscribeChat(); unsubscribeChat = null; }
      chatMessages.innerHTML = '';

      const fakeData = [
        { senderName: "Rakha FR",  senderPhoto: "https://i.pinimg.com/736x/bd/6d/f7/bd6df73658dc4fffa2022b47a66eb61f.jpg", messageText: "kalian bisa chat disini teman teman!",  timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) } },
        { senderName: "Rakha Fr",  senderPhoto: "https://rakhafr.github.io/RFR_PORTOFOLIO/img/hero.jpeg",                   messageText: "akun ke 2 testing!!",                    timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 15) } },
        { senderName: "Xzea",      senderPhoto: "https://i.pinimg.com/1200x/97/f6/eb/97f6ebf655cfbaeeff728a10d310a96b.jpg", messageText: "MANTAP NGABB!!!",                        timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 *  5) } },
      ];

      fakeData.forEach((data, index) => renderMessage(`fake-${index}`, data, true));
      scrollToBottom();
    }

    // ─── E. Render bubble ───
    function renderMessage(id, data, isPreview = false) {
      const isMine = currentUser && (data.senderName === currentUser.displayName || data.senderName === currentUser.email);

      const bubble = document.createElement("div");
      bubble.id        = `msg-${id}`;
      bubble.className = `chat-bubble ${isMine ? 'mine' : ''} ${isPreview ? 'preview-chat' : ''}`;

      let formattedTime = "Baru saja";
      if (data.timestamp) {
        formattedTime = data.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      const cleanText = escapeHTML(data.messageText);
      const cleanName = escapeHTML(data.senderName);
      const photoURL  = data.senderPhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=guest";

      bubble.innerHTML = `
        <img src="${photoURL}" alt="${cleanName}" class="bubble-avatar" referrerpolicy="no-referrer">
        <div class="bubble-content">
          <div class="bubble-meta">
            <span class="bubble-sender">${cleanName}</span>
            <span class="bubble-time">${formattedTime}</span>
          </div>
          <div class="bubble-text-box"><p>${cleanText}</p></div>
        </div>`;

      chatMessages.appendChild(bubble);
    }

    function escapeHTML(str) {
      if (!str) return '';
      return str.replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m]));
    }

    function scrollToBottom() { chatMessages.scrollTop = chatMessages.scrollHeight; }

    // ─── F. Send message ───
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!currentUser) { alert("Anda harus login terlebih dahulu."); return; }

      const messageText = chatInputText.value.trim();
      if (!messageText) return;
      if (messageText.length > 200) { alert("Pesan melebihi batas 200 karakter."); return; }

      const now = Date.now();
      if (now - lastSentTime < cooldownMs) {
        const remaining = Math.ceil((cooldownMs - (now - lastSentTime)) / 1000);
        alert(`Harap tunggu ${remaining} detik sebelum mengirim pesan.`);
        return;
      }

      chatInputText.disabled    = true;
      btnSendMessage.disabled   = true;

      try {
        await window.db.collection("chats").add({
          senderName:  currentUser.displayName || "User Google",
          senderPhoto: currentUser.photoURL    || "",
          messageText: messageText,
          timestamp:   firebase.firestore.FieldValue.serverTimestamp()
        });

        chatInputText.value = "";
        chatCharCounter.textContent = "0 / 200";
        chatCharCounter.classList.remove("limit-warn");
        lastSentTime = Date.now();
      } catch (err) {
        console.error("Gagal kirim:", err);
        alert("Gagal mengirim pesan. Silakan coba lagi.");
      } finally {
        chatInputText.disabled  = false;
        btnSendMessage.disabled = false;
        chatInputText.focus();
        scrollToBottom();
      }
    });
  }
})();