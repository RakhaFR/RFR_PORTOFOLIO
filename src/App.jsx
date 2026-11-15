import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DirectionAwareSelection } from "./components/DirectionAwareSelection";
import { HoverImageLinks } from "./components/HoverImageLinks";
import { StackingSkillCards } from "./components/StackingSkillCards";
import { Galaxy } from "./components/Galaxy";
import "../style.css";
import "./animations.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = [0.22, 1, 0.36, 1];

// Interactive 3D Card with dynamic spotlight & border beam
const InteractiveTiltCard = ({ children, className = "", style = {}, ...props }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  return (
    <div
      ref={cardRef}
      className={`interactive-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      <div className="card-spotlight" />
      {children}
    </div>
  );
};

// Rich Mini-IDE Floating Windows (Hero Ambience)
const FloatingCodeWindows = () => {
  const windows = [
    {
      file: "motion.jsx",
      top: "10%",
      left: "2%",
      speed: 0.15,
      code: (
        <>
          <span className="token-keyword">const</span> <span className="token-function">portfolio</span> = {"{"}
          <br />
          &nbsp;&nbsp;aesthetic: <span className="token-string">"100%"</span>,
          <br />
          &nbsp;&nbsp;smooth: <span className="token-keyword">true</span>
          <br />
          {"}"};
        </>
      ),
    },
    {
      file: "experience.ts",
      top: "84%",
      left: "44%",
      speed: 0.12,
      code: (
        <>
          <span className="token-comment">// Front-end perfection</span>
          <br />
          <span className="token-keyword">await</span> <span className="token-function">deliverArt</span>();
        </>
      ),
    },
    {
      file: "stack.json",
      top: "10%",
      left: "82%",
      speed: 0.18,
      code: (
        <>
          <span className="token-string">"framework"</span>: <span className="token-keyword">"React 18"</span>,
          <br />
          <span className="token-string">"engine"</span>: <span className="token-keyword">"GSAP Core"</span>
        </>
      ),
    },
    {
      file: "passion.rs",
      top: "84%",
      left: "78%",
      speed: 0.1,
      code: (
        <>
          <span className="token-function">fn</span> <span className="token-keyword">innovate</span>() -&gt; <span className="token-function">Wow</span> {"{"}
          <br />
          &nbsp;&nbsp;<span className="token-keyword">Self</span>::ignite()
          <br />
          {"}"}
        </>
      ),
    },
  ];

  return (
    <div className="hero-floating-tokens" aria-hidden="true">
      {windows.map((win, idx) => (
        <div
          key={idx}
          className="code-window-card"
          data-speed={win.speed}
          style={{ top: win.top, left: win.left }}
        >
          <div className="code-window-header">
            <div className="window-dots">
              <span className="window-dot dot-red"></span>
              <span className="window-dot dot-yellow"></span>
              <span className="window-dot dot-green"></span>
            </div>
            <span className="window-filename">{win.file}</span>
          </div>
          <div className="code-window-body">{win.code}</div>
        </div>
      ))}
    </div>
  );
};

const JOURNEY_STAGES = [
  {
    step: "01",
    phase: "PHASE 01 · 2022-2023",
    stagePill: "FOUNDATION & WEB STANDARDS",
    title: "Web Standards & Semantic Architecture",
    summary:
      "Awal mula perjalanan web engineering: mendalami struktur semantic HTML5, aksesibilitas modern, responsive box model, dan visual styling CSS3.",
    skills: [
      {
        id: "html",
        name: "HTML5",
        percent: "95%",
        level: "Mastered",
        icon: "/ui/img/html-icon.png",
        desc: "Struktur dasar semantic web, SEO, dan aksesibilitas.",
      },
      {
        id: "css",
        name: "CSS3",
        percent: "96%",
        level: "Mastered",
        icon: "/ui/img/css-icon.svg",
        desc: "Visual styling, responsive grid, flexbox, dan keyframes.",
      },
    ],
  },
  {
    step: "02",
    phase: "PHASE 02 · 2023-2024",
    stagePill: "CLIENT-SIDE LOGIC & UTILITY",
    title: "Client-Side Logic & Utility Styling",
    summary:
      "Mengembangkan interaktivitas dinamis dan efisiensi antarmuka tingkat tinggi menggunakan engine JavaScript modern serta ekosistem framework CSS utility-first.",
    skills: [
      {
        id: "js",
        name: "JavaScript",
        percent: "70%",
        level: "Proficient",
        icon: "/ui/img/js-icon.svg",
        desc: "Interaktivitas dinamis, DOM manipulation, dan async logic.",
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        percent: "80%",
        level: "Advanced",
        icon: "/ui/img/tailwind-icon.png",
        desc: "Framework CSS utility-first untuk desain cepat & modern.",
      },
      {
        id: "bootstrap",
        name: "Bootstrap 5",
        percent: "55%",
        level: "Intermediate",
        icon: "/ui/img/boostrap-icon.svg",
        desc: "Prototyping cepat responsif dengan komponen modular.",
      },
    ],
  },
  {
    step: "03",
    phase: "PHASE 03 · 2024-2025",
    stagePill: "MODERN REACTIVE FRONTEND",
    title: "Reactive Component Architecture & APIs",
    summary:
      "Transisi ke ekosistem SPA & SSR berbasis komponen reaktif, sinkronisasi data client-server, asynchronous state, dan integrasi RESTful API.",
    skills: [
      {
        id: "react",
        name: "React.js",
        percent: "50%",
        level: "Active Focus",
        icon: "/ui/img/react-icon.svg",
        desc: "Pustaka UI reaktif Meta, custom hooks & virtual DOM.",
      },
      {
        id: "nextjs",
        name: "Next.js",
        percent: "40%",
        level: "Developing",
        icon: "/ui/img/next-icon.svg",
        desc: "Framework React dengan SSR, App Router, dan SEO built-in.",
      },
      {
        id: "axios",
        name: "Axios",
        percent: "40%",
        level: "Intermediate",
        icon: "/ui/img/axios-icon.svg",
        desc: "HTTP client promise-based untuk komunikasi REST API.",
      },
    ],
  },
  {
    step: "04",
    phase: "PHASE 04 · 2025-PRESENCE",
    stagePill: "BACKEND SERVICES & SYSTEMS",
    title: "Backend Services & System Architecture",
    summary:
      "Ekspansi kapabilitas ke computational backend, pengelolaan database relasional, API services, dan skrip otomasi komputasi tingkat lanjut.",
    skills: [
      {
        id: "php",
        name: "PHP",
        percent: "45%",
        level: "Intermediate",
        icon: "/ui/img/php-icon.svg",
        desc: "Server-side scripting, database MySQL, dan session auth.",
      },
      {
        id: "laravel",
        name: "Laravel",
        percent: "35%",
        level: "Exploring",
        icon: "/ui/img/Laravel-icon.svg",
        desc: "Framework MVC PHP elegan dengan Eloquent ORM & migrations.",
      },
      {
        id: "python",
        name: "PYTHON",
        percent: "35%",
        level: "Exploring",
        icon: "/ui/img/python-icon.svg",
        desc: "Bahasa komputer serbaguna untuk automasi dan algoritma dasar.",
      },
      {
        id: "express",
        name: "Express.js",
        percent: "15%",
        level: "Foundational",
        icon: "/ui/img/express-icon.svg",
        desc: "Framework Node.js minimalis untuk microservices & REST API.",
      },
    ],
  },
];

const PORTFOLIO_PROJECTS = [
  {
    title: "Plenger RnG",
    tag: "Game",
    desc: "Permainan gacha visual simpel untuk mendapatkan muka-muka lucu dan kocak dengan rarity berbeda.",
    href: "https://plenger-rng.vercel.app/",
    img: "/img/projek/PlengerRng.jpg",
  },
  {
    title: "Reflex Rhythm",
    tag: "Game",
    desc: "Permainan yang menguji kecepatan dan ketepatan refleks jari Anda dengan tantangan beat.",
    href: "https://reflex-rhythm.vercel.app/",
    img: "/img/projek/ReflexGame.png",
  },
  {
    title: "The Survey",
    tag: "Visual Novel Game",
    desc: "Visual novel psikologis yang menceritakan perjuangan seseorang keluar dari isolasi diri.",
    href: "https://rakhafr.github.io/TheSurvey/",
    img: "/img/projek/TheSurvey.png",
  },
  {
    title: "Bootstrap Template Hub",
    tag: "UI Library",
    desc: "Kumpulan komponen Bootstrap 5.3 lengkap, siap pakai, modern, dan 100% offline.",
    href: "https://rakhafr.github.io/Boostrap-template-class/",
    img: "/img/projek/boostrap-template-class.png",
  },
  {
    title: "SkyCast",
    tag: "Weather Dashboard",
    desc: "Platform pemantau cuaca cerdas menyajikan suhu real-time, kelembapan, dan kualitas udara.",
    href: "https://sky-cast-iota-lime.vercel.app/",
    img: "/img/projek/skyCast.png",
  },
  {
    title: "TheotownHub",
    tag: "Community Hub",
    desc: "Pusat info plugin TheoTown terbaru, creator certified, showcase kota, dan update mingguan.",
    href: "https://theotownhub.vercel.app/",
    img: "/img/projek/theotownHub.png",
  },
  {
    title: "Me Anim",
    tag: "Platform",
    desc: "Platform UI modern yang mengonsumsi scraping API untuk katalog streaming anime visual.",
    href: "https://me-anim.vercel.app/",
    img: "/img/projek/me-anim.png",
  },
  {
    title: "Me Anim API Explorer",
    tag: "Public REST API",
    desc: "REST API Express + TypeScript scraping 4 sumber anime Indonesia dengan dokumentasi interaktif.",
    href: "https://me-anim-api-explorer.vercel.app/",
    img: "/img/projek/me-anim-api-explorer.png",
  },
  {
    title: "Powernet",
    tag: "Web App",
    desc: "System integrator and IT enterprise solution provider terkemuka di Indonesia.",
    href: "https://powernet.co.id/",
    img: "/img/projek/Powernet.png",
  },
  {
    title: "EduWave",
    tag: "E-Learning",
    desc: "Platform edukasi digital modern dan interaktif untuk kegiatan belajar siswa SMP dan SMA.",
    href: "https://edu-waveid.vercel.app/",
    img: "/img/projek/eduwave.png",
  },
  {
    title: "SaveAja",
    tag: "Media Downloader",
    desc: "Unduh video TikTok tanpa watermark, Instagram Reels, dan YouTube audio/video instan.",
    href: "https://save-aja.vercel.app/",
    img: "/img/projek/saveaja.png",
  },
];

const CERTIFICATES = [
  {
    title: "Sertifikat Digiup 2025 (Halaman 1)",
    meta: "Telkom Indonesia · 2025",
    desc: "Sertifikat kelulusan program Digiup 2025 dari Telkom Indonesia dalam fase pembekalan junior web developer.",
    img: "/img/Sertfikat/Sertifikat_digiup_page-0001.jpg",
  },
  {
    title: "Sertifikat Digiup 2025 (Halaman 2)",
    meta: "Telkom Indonesia · 2025",
    desc: "Transkrip kompetensi dan capaian materi teknis pengembangan web terstruktur program Digiup Telkom Indonesia.",
    img: "/img/Sertfikat/Sertifikat_digiup_page-0002.jpg",
  },
  {
    title: "Sertifikat Google",
    meta: "Google · Credential",
    desc: "Sertifikasi resmi Google atas penyelesaian modul dan kompetensi digital dasar berstandar industri.",
    img: "/img/Sertfikat/sertifikat_google.png",
  },
  {
    title: "Sertifikat Lomba OSCAR 3.0",
    meta: "OSCAR 3.0 · Competition",
    desc: "Penghargaan partisipasi dan pencapaian dalam kompetisi teknologi OSCAR 3.0 tingkat pelajar/umum.",
    img: "/img/Sertfikat/sertifika_lomba _oscar_3.0.png",
  },
];

export default function App() {
  const shouldReduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home-content");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Firebase Chat States
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatText, setChatText] = useState("");
  const [lastSentTime, setLastSentTime] = useState(0);

  const appRef = useRef(null);
  const mouseGlowRef = useRef(null);
  const hscrollWrapRef = useRef(null);
  const hscrollInnerRef = useRef(null);
  const hscrollTrackRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // Resize listener & Section Spy
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      const sections = ["home-content", "about", "gallery", "skill", "slider", "projek", "chat", "contact"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Firebase Chat integration
  useEffect(() => {
    let unsubscribe = null;
    const checkFirebase = setInterval(() => {
      if (window.auth && window.db) {
        clearInterval(checkFirebase);

        window.auth.onAuthStateChanged((user) => {
          setCurrentUser(user);
          if (user) {
            setChatLoading(true);
            if (unsubscribe) unsubscribe();

            unsubscribe = window.db
              .collection("chats")
              .orderBy("timestamp", "asc")
              .limitToLast(50)
              .onSnapshot(
                (snapshot) => {
                  setChatLoading(false);
                  const msgs = [];
                  snapshot.forEach((doc) => {
                    msgs.push({ id: doc.id, ...doc.data() });
                  });
                  setMessages(msgs);
                  setTimeout(() => {
                    if (chatMessagesRef.current) {
                      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
                    }
                  }, 100);
                },
                (error) => {
                  console.error("Firestore error:", error);
                  setChatLoading(false);
                }
              );
          } else {
            setChatLoading(false);
            setMessages([
              {
                id: "fake-0",
                senderName: "Rakha FR",
                senderPhoto: "https://i.pinimg.com/736x/bd/6d/f7/bd6df73658dc4fffa2022b47a66eb61f.jpg",
                messageText: "kalian bisa chat disini teman teman!",
                timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) },
              },
              {
                id: "fake-1",
                senderName: "Rakha Fr",
                senderPhoto: "/img/hero.jpeg",
                messageText: "akun ke 2 testing!!",
                timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 15) },
              },
              {
                id: "fake-2",
                senderName: "Xzea",
                senderPhoto: "https://i.pinimg.com/1200x/97/f6/eb/97f6ebf655cfbaeeff728a10d310a96b.jpg",
                messageText: "MANTAP NGABB!!!",
                timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 5) },
              },
            ]);
          }
        });
      }
    }, 150);

    return () => {
      clearInterval(checkFirebase);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Mouse Follower Aurora — separate useEffect (prevents early return bug)
  useEffect(() => {
    if (shouldReduce) return;
    if (!mouseGlowRef.current) return;

    const xTo = gsap.quickTo(mouseGlowRef.current, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(mouseGlowRef.current, "y", { duration: 0.5, ease: "power3" });

    const onMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [shouldReduce]);

  // Header show/hide on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const header = document.getElementById("main-header");
    if (!header) return;

    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY;
      if (Math.abs(diff) > 5) {
        if (currentY > lastScrollY && currentY > 80) {
          header.classList.add("header--hidden");
        } else {
          header.classList.remove("header--hidden");
        }
        lastScrollY = currentY;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGoogleLogin = async () => {
    if (!window.auth || !window.googleProvider) return;
    try {
      await window.auth.signInWithPopup(window.googleProvider);
    } catch (e) {
      console.error(e);
      alert("Login gagal.");
    }
  };

  const handleLogout = async () => {
    if (!window.auth) return;
    try {
      await window.auth.signOut();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const text = chatText.trim();
    if (!text) return;
    if (text.length > 200) {
      alert("Maksimal 200 karakter.");
      return;
    }
    const now = Date.now();
    if (now - lastSentTime < 2000) {
      alert("Tunggu 2 detik.");
      return;
    }

    try {
      setLastSentTime(now);
      await window.db.collection("chats").add({
        senderName: currentUser.displayName || "Anonymous",
        senderPhoto: currentUser.photoURL || "",
        messageText: text,
        timestamp: window.firebase.firestore.FieldValue.serverTimestamp(),
      });
      setChatText("");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pesan.");
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // GSAP 60FPS MASTER TIMELINES & SCROLLTRIGGERS
  // ═══════════════════════════════════════════════════════════════
  useGSAP(
    () => {
      if (shouldReduce) return;

      // ── 1. Hero Cinematic Entrance Timeline ──────────────────
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTl
        .from(".hero-location-text", { y: -20, opacity: 0, duration: 0.6 }, 0.05)
        .fromTo(
          ".hero-title-word",
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.14, duration: 1.1, ease: "power4.out" },
          0.15
        )
        .from(".home-content p", { y: 25, opacity: 0, duration: 0.8 }, 0.5)
        .from(".btn-box a", { y: 25, opacity: 0, stagger: 0.1, duration: 0.6 }, 0.7)
        .from(
          ".home-sci .social",
          {
            scale: 0,
            opacity: 0,
            rotation: -15,
            stagger: 0.05,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          0.8
        )
        .from(
          ".hero-img-wrap",
          {
            scale: 0.88,
            opacity: 0,
            rotationY: 20,
            duration: 1.2,
            ease: "power3.out",
          },
          0.3
        )
        .from(
          ".code-window-card",
          {
            scale: 0.6,
            opacity: 0,
            rotationY: -20,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
          },
          0.6
        );

      // ── 2. Floating Mini IDE Windows (Continuous Natural Drift + Parallax) ──
      gsap.utils.toArray(".code-window-card").forEach((win, i) => {
        const speed = parseFloat(win.getAttribute("data-speed") || "0.1");

        // Gentle natural idle float — stay in corner bounds
        gsap.to(win, {
          y: `+=${gsap.utils.random(10, 18)}`,
          x: `+=${gsap.utils.random(-8, 8)}`,
          rotationZ: gsap.utils.random(-2.5, 2.5),
          duration: 3.5 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.15,
        });

        // Subtle Scroll Parallax Scrub
        gsap.to(win, {
          yPercent: -speed * 90,
          scrollTrigger: {
            trigger: "#home-content",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });

      // ── 3. Hero Magnetic Parallax on Image ──────────────────
      const heroImageWrap = document.querySelector(".hero-img-wrap");
      if (heroImageWrap) {
        const imgXTo = gsap.quickTo(".blob-frame", "rotationY", { duration: 0.6, ease: "power3" });
        const imgYTo = gsap.quickTo(".blob-frame", "rotationX", { duration: 0.6, ease: "power3" });

        const handleHeroMouse = (e) => {
          const rect = heroImageWrap.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          imgXTo(x * 20);
          imgYTo(-y * 20);
        };
        const handleHeroLeave = () => {
          imgXTo(0);
          imgYTo(0);
        };
        heroImageWrap.addEventListener("mousemove", handleHeroMouse);
        heroImageWrap.addEventListener("mouseleave", handleHeroLeave);
      }

      // Hero Stat Badge natural float
      gsap.to(".hero-stat-badge", {
        y: -10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ── 4. Horizontal 3D Fisheye Parallax Tech Stack (PINNED FIRST in DOM order) ──
      const track = hscrollTrackRef.current;
      const wrap = hscrollWrapRef.current;
      const inner = hscrollInnerRef.current;

      if (track && wrap && inner) {
        const calculateShift = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const words = track.querySelectorAll(".hscroll-word");

        gsap.to(track, {
          x: () => -calculateShift(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${calculateShift()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            refreshPriority: 10,
            onUpdate: (self) => {
              inner.style.setProperty("--hscroll-progress", `${(self.progress * 100).toFixed(2)}%`);
              const focusX = window.innerWidth * 0.5;
              let best = null;
              let minDistance = Infinity;

              words.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const midX = rect.left + rect.width / 2;
                const distance = Math.abs(midX - focusX);
                if (distance < minDistance) {
                  minDistance = distance;
                  best = el;
                }
              });

              words.forEach((el) => {
                const isSelected = el === best;
                el.classList.toggle("active-word", isSelected);
              });
            },
          },
        });
      }

      // ── 5. About Section Entrance & Photo Parallax ──────────
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#about",
          start: "top 85%",
          fastScrollEnd: true,
          toggleActions: "play none none none",
        },
      });
      aboutTl
        .from("#about .section-pill", { y: 20, opacity: 0, duration: 0.35, ease: "power3.out" })
        .from("#about .sub-main h2", { y: 35, opacity: 0, duration: 0.45, ease: "power3.out" }, "-=0.25")
        .from("#about .text-float", { y: 25, opacity: 0, duration: 0.45, ease: "power3.out" }, "-=0.3")
        .from(
          "#about .stat-item",
          {
            y: 20,
            opacity: 0,
            scale: 0.9,
            stagger: 0.06,
            duration: 0.4,
            ease: "back.out(1.5)",
          },
          "-=0.25"
        )
        .fromTo(
          "#about .about-img-item",
          { opacity: 0, y: 35, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        );

      // Smooth Scroll Parallax between the two About photos
      gsap.to("#about .about-img-item:first-child", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
      gsap.to("#about .about-img-item.offset", {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // ── 6. Gallery Section Entrance ─────────────────────────
      const galleryTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#gallery",
          start: "top 85%",
          fastScrollEnd: true,
          toggleActions: "play none none none",
        },
      });
      galleryTl
        .from("#gallery .section-pill", { y: 20, opacity: 0, duration: 0.35, ease: "power3.out" })
        .from("#gallery .heading", { y: 30, opacity: 0, duration: 0.45, ease: "power3.out" }, "-=0.25")
        .from("#gallery .gallery-container", { y: 30, opacity: 0, duration: 0.45, ease: "power3.out" }, "-=0.25")
        .fromTo(
          "#gallery .gallery-preview img",
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          "#gallery .thumb",
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.03, duration: 0.4, ease: "power3.out" },
          "-=0.3"
        );

      // ── 7. Skills Roadmap Section Entrance ──────────────────
      const skillTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#skill",
          start: "top 85%",
          fastScrollEnd: true,
          toggleActions: "play none none none",
        },
      });
      skillTl
        .from("#skill .section-pill", { y: 20, opacity: 0, duration: 0.35, ease: "power3.out" })
        .from("#skill .heading", { y: 30, opacity: 0, duration: 0.45, ease: "power3.out" }, "-=0.25");

      // ── 8. Certificates / Slider Entrance ───────────────────
      const sliderTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#slider",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      sliderTl
        .from("#slider .section-pill", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from("#slider .heading", { y: 50, opacity: 0, rotationX: -15, duration: 0.9, ease: "power4.out" }, "-=0.4")
        .fromTo(
          "#slider .cv-medal > div",
          { opacity: 0, y: 60, rotationX: 18, scale: 0.92 },
          { opacity: 1, y: 0, rotationX: 0, scale: 1, stagger: 0.12, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        );

      // ── 9. Portfolio Section Entrance ───────────────────────
      const projekTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#projek",
          start: "top 85%",
          fastScrollEnd: true,
          toggleActions: "play none none none",
        },
      });
      projekTl
        .from("#projek .section-pill", { y: 20, opacity: 0, duration: 0.35, ease: "power3.out" })
        .from("#projek .heading", { y: 30, opacity: 0, duration: 0.45, ease: "power3.out" }, "-=0.25")
        .fromTo(
          "#projek .hover-link-item",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.04, duration: 0.45, ease: "power3.out" },
          "-=0.2"
        );

      // ── 10. Chat Room Entrance ──────────────────────────────
      const chatTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#chat",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      chatTl
        .from("#chat .section-pill", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from("#chat .heading", { y: 50, opacity: 0, rotationX: -15, duration: 0.9, ease: "power4.out" }, "-=0.4")
        .from("#chat .chat-container", { y: 60, opacity: 0, scale: 0.96, duration: 0.9, ease: "power3.out" }, "-=0.4");

      // ── 11. Contact Section Entrance ────────────────────────
      const contactTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#contact",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      contactTl
        .from("#contact .section-pill", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from("#contact .heading", { y: 50, opacity: 0, rotationX: -15, duration: 0.9, ease: "power4.out" }, "-=0.4")
        .fromTo(
          "#contact .contact-card",
          { opacity: 0, y: 60, rotationX: 18, scale: 0.92 },
          { opacity: 1, y: 0, rotationX: 0, scale: 1, stagger: 0.12, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        );

      // ── 12. Footer Reveal ───────────────────────────────────
      gsap.from("footer", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "footer",
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });

      // Synchronize ScrollTrigger calculations
      ScrollTrigger.refresh();
    },
    { scope: appRef, dependencies: [shouldReduce] }
  );

  return (
    <div ref={appRef} className="portfolio-app">
      {/* ── Spotlight Cursor Follower ──────────────── */}
      <div ref={mouseGlowRef} className="mouse-follower-glow" aria-hidden="true" />

      {/* ── Header ─────────────────────────────────── */}
      <header className="header" id="main-header">
        <a href="#home-content" className="logo">
          Rakha<span>.</span>
        </a>
        <input
          type="checkbox"
          id="check"
          checked={isNavOpen}
          onChange={(e) => setIsNavOpen(e.target.checked)}
        />
        <label htmlFor="check" className="icons" onClick={() => setIsNavOpen(!isNavOpen)}>
          <i className="bx bx-menu" id="menu-icon"></i>
          <i className="bx bx-x" id="close-icon"></i>
        </label>
        <nav className="navbar">
          {[
            { id: "home-content", label: "Home" },
            { id: "about", label: "About" },
            { id: "gallery", label: "Gallery" },
            { id: "skill", label: "Skill" },
            { id: "slider", label: "Certificate" },
            { id: "projek", label: "Portfolio" },
            { id: "chat", label: "Chat" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? "active" : ""}
              onClick={() => setIsNavOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <motion.a
          href="https://wa.me/6282111762085"
          className="header-cta"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↓ Contact Me
        </motion.a>
      </header>

      {/* ── Home (100x Lebih Hidup & Sinematik) ────── */}
      <section className="home-content full" id="home-content">
        <div id="hero-3d-container">
          <Galaxy
            transparent={true}
            starSpeed={0.5}
            speed={1.0}
            density={1.2}
            starSize={1.1}
            glowIntensity={0.4}
            twinkleIntensity={0.6}
            mouseInteraction={true}
            mouseRepulsion={true}
            repulsionStrength={2.5}
            clickWarp={true}
            starColors={["#BAFF4F", "#ffffff", "#80ffaa", "#d4ff70"]}
          />
        </div>

        {/* Ambient background mesh orbs */}
        <div className="hero-ambient-mesh" aria-hidden="true">
          <div className="mesh-orb mesh-orb-1" />
          <div className="mesh-orb mesh-orb-2" />
        </div>

        {/* Floating Mini IDE Windows */}
        <FloatingCodeWindows />

        <div className="content">
          <p className="hero-location-text">Bogor, West Java</p>
          <h1>
            <span className="hero-title-line">
              <span className="hero-title-word">Rakha</span>
            </span>
            <span className="hero-title-line">
              <em className="highlight hero-title-word hero-shimmer">Fadilah</em>
            </span>
            <span className="hero-title-line">
              <span className="hero-title-word">Riyadi</span>
            </span>
          </h1>
          <p>
            Front-end developer from Bogor. 3 year crafting clean, functional, and visually memorable websites. I treat code as craft.
          </p>
          <div className="btn-box">
            <motion.a href="#projek" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <span>View Portfolio</span>
            </motion.a>
            <motion.a href="#contact" className="btn-outline" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <span>Contact Me</span>
            </motion.a>
          </div>
          <div className="home-sci">
            {[
              { href: "https://www.facebook.com/profile.php?id=100084701316322&mibextid=ZbWKwL", name: "Facebook", icon: "/ui/img/facebook-icon.svg" },
              { href: "http://tiktok.com/@xzearty_", name: "TikTok", icon: "/ui/img/tiktok-icon.svg" },
              { href: "https://www.instagram.com/bang_r1yad1/", name: "Instagram", icon: "/ui/img/instagram-icon.svg" },
              { href: "https://wa.me/6282111762085", name: "WhatsApp", icon: "/ui/img/whatsapp-icon.svg" },
              { href: "https://lynk.id/bangriyadi/s/z6l332ojeqrg", name: "Support Me", icon: "/ui/img/lynkId-icon.png" },
              { href: "https://discord.com/users/1274191390246440981", name: "Discord", icon: "/ui/img/discord-icon.svg" },
              { href: "https://github.com/RakhaFR/", name: "GitHub", icon: "/ui/img/github-icon.png" },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className="social"
                data-name={social.name}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -6, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <img src={social.icon} alt={social.name} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="content margin-top">
          <div className="hero-img-wrap">
            <div className="hero-glow"></div>
            <div className="blob-frame">
              <img src="/img/hero.jpeg" alt="Foto Profil" />
              <div className="hero-img-overlay"></div>
            </div>
            <div className="hero-stat-badge">
              <div className="stat-label">Open to make projects</div>
              <div className="stat-value">Junior Dev · 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Strip 1 ── */}
      <div className="marquee-strip lime-strip">
        <div className="marquee-track">
          {Array(8)
            .fill("JUNIOR WEB DEVELOPER • FRONT-END CRAFT • CLEAN CODE • ")
            .map((txt, index) => (
              <span key={index}>{txt}&nbsp;</span>
            ))}
        </div>
      </div>

      {/* ── Horizontal Parallax Scroll (Tech Stack 3D Fisheye) ── */}
      <div className="hscroll-about-scene">
        <div className="hscroll-wrap" id="hscrollWrap" ref={hscrollWrapRef}>
          <div className="hscroll-inner" ref={hscrollInnerRef}>
            <div className="hscroll-track" id="hscrollTrack" ref={hscrollTrackRef}>
              {[
                "HTML",
                "CSS",
                "JavaScript",
                "Tailwind CSS",
                "PHP",
                "Laravel",
                "Bootstrap",
                "Python",
                "React",
                "Next JS",
                "Axios",
                "Express JS",
              ].map((tech, index) => (
                <React.Fragment key={index}>
                  <span className="hscroll-word">{tech}</span>
                  <span className="hscroll-sep">•</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── About (Surprise Reveal) ──────────────────── */}
      <section className="about full reveal-curtain" id="about" ref={aboutSectionRef}>
        <div className="about-inner">
          <div className="about-left">
            <span className="section-pill dark">About Me</span>
            <div className="sub-main">
              <div className="about-img-col">
                <img src="/img/gallery/Rakha.jpg" alt="About Photo" />
              </div>
              <h2>
                Building
                <br />
                <em>code</em> as
                <br />
                an art form
              </h2>
            </div>
            <div className="text-float">
              <div className="text-box">
                <DirectionAwareSelection />
              </div>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-num">3+</span>
                <span className="stat-lbl">Year Exp.</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">9</span>
                <span className="stat-lbl">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-lbl">Dedication</span>
              </div>
            </div>
          </div>
          <div className="about-right">
            <div className="about-img-grid">
              <div className="about-img-item">
                <img src="/img/gallery/mukaGanteng.jpg" alt="Rakha FR Portrait" loading="eager" />
              </div>
              <div className="about-img-item offset">
                <img src="/img/gallery/mukaGanteng2.jpeg" alt="Rakha FR Creative Dev" loading="eager" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery ────────────────────────────────── */}
      <section className="gallery full" id="gallery">
        <span className="section-pill light">Gallery</span>
        <h2 className="heading">
          MY <span>GALLERY</span>
        </h2>
        <div className="gallery-container">
          <div className="gallery-preview">
            <img src="/img/hero.jpeg" alt="Foto Saya" />
            <p>Foto Saya di depan kaca hotel</p>
          </div>
          <div className="gallery-thumbs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Pilih kategori gallery"
            >
              <option value="all">Category All</option>
              <option value="portfolio">My Gallery</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="Acara">Acara</option>
            </select>
            <div className="thumb-grid">
              {[
                { cat: "portfolio", title: "Idolawan", desc: "I Love Shinobu Uzuki", img: "/img/gallery/Shinobu Uzuki • Mayonaka Heart Tune.jpg" },
                { cat: "portfolio", title: "Berenang", desc: "Berenang di Fishing Valley", img: "/img/gallery/berenangFV.jpeg" },
                { cat: "kegiatan", title: "Zoom Telkom Digiup 2025", desc: "Pelatihan web development with laravel", img: "/img/gallery/zoomDigiup2025.png" },
                { cat: "kegiatan", title: "Ngoding di kelas", desc: "Gak tau siapa yang motret ini?!", img: "/img/gallery/ngodingDiKelas.jpg" },
                { cat: "kegiatan", title: "Ekskul Nevtik Fase 2", desc: "Mau masuk konsep OOP JavaScript!", img: "/img/gallery/Nevtik.jpg" },
                { cat: "kegiatan", title: "Nongkrong", desc: "Nongkrong di pemandangan bukit area cibinong", img: "/img/gallery/nongkrong.jpeg" },
                { cat: "kegiatan", title: "Nongki di cafe", desc: "Nongki di cafe bareng temen pas buka puasa", img: "/img/gallery/nongkiCafe.jpeg" },
                { cat: "Acara", title: "Sigma moment", desc: "bakar bakar di rumah temen", img: "/img/gallery/sigmaMoment.jpeg" },
              ]
                .filter((item) => selectedCategory === "all" || item.cat.toLowerCase() === selectedCategory.toLowerCase())
                .map((item, index) => (
                  <motion.div
                    key={index}
                    className="thumb"
                    data-category={item.cat}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img src={item.img} alt={item.title} />
                    <div className="overlay">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
            <motion.button
              type="button"
              className="btn-more"
              onClick={() => setIsPopupOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              MORE →
            </motion.button>
          </div>
        </div>
      </section>

      {/* Popup Gallery */}
      {isPopupOpen && (
        <motion.div
          className="popup-gallery"
          id="popupGallery"
          style={{ display: "block" }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="popup-content">
            <button
              type="button"
              className="close"
              onClick={() => setIsPopupOpen(false)}
              aria-label="Tutup popup"
            >
              &times;
            </button>
            <div className="popup-grid">
              {[
                { img: "/img/gallery/nongkrong2.jpeg", title: "Nongkrong", desc: "Foto iseng di cafe di area bukit cibing" },
                { img: "/img/gallery/diBioskop.jpeg", title: "Di Bioskop", desc: "Nonton film di bioskop ama temen kelas smp berlima" },
                { img: "/img/gallery/diKampusGnd.jpeg", title: "Di Kampus Guna Darma", desc: "Ikut sama bokap ke kampus gunadarma & bertemu dengan mahasiswa" },
                { img: "/img/gallery/dirumah.jpeg", title: "Di Rumah", desc: "foto gabut di rumah" },
                { img: "/img/gallery/byat.jpeg", title: "Gabut ama bocil", desc: "Foto gabut nungguin emak belanja di baju di mall" },
                { img: "/img/gallery/nongkiCafe2.jpeg", title: "Nongki Cafe2", desc: "Nongki di cafe bareng temen pas buka puasa" },
                { img: "/img/gallery/amaGilang.jpeg", title: "Bareng Gilang", desc: "Foto studyTour di museum" },
                { img: "/img/gallery/trioN.jpeg", title: "Trio AJE", desc: "Foto study di luar museum bareng Mahesa & Gilang" },
                { img: "/img/gallery/museumBi.jpeg", title: "Di Dalam Museum", desc: "Foto study di dalam museum ama patung tentara" },
                { img: "/img/gallery/waroengSteak.jpeg", title: "Waroeng Steak", desc: "Makan steak bareng temen kelas 9 gw, di waroeng steak" },
                { img: "/img/gallery/gabutSekolah.jpeg", title: "Gabut sekolah", desc: "Foto gabut di sekolah ama Gavin" },
                { img: "/img/gallery/ipo.jpeg", title: "Jadi Cover", desc: "cosplay jadi cover anime" },
                { img: "/img/gallery/malamTahunBaru.jpeg", title: "Malam Tahun Baru", desc: "Foto malam tahun baru sama keluarga menggril daging" },
                { img: "/img/gallery/perpisahan9.jpeg", title: "Perpisahan Kelas 9", desc: "Foto perpisahan dengan teman-teman kelas 9" },
                { img: "/img/gallery/Takanashi_Hoshino.jpg", title: "My Luv Takanashi Hoshino", desc: '"uhehehehh..."' },
                { img: "/img/gallery/ToBeHeroX.jpg", title: "Donghua TO BE HERO X", desc: "Salah Satu Anime Donghua yang KECE BADAI" },
              ].map((p, idx) => (
                <div key={idx} className="popup-item">
                  <img src={p.img} alt={p.title} />
                  <div className="overlay">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Skills (Vertical Stacking Journey Roadmap) ─── */}
      <section className="skill full" id="skill">
        <span className="section-pill light">Roadmap</span>
        <h2 className="heading">
          Technical <span>Journey</span>
        </h2>

        <StackingSkillCards stages={JOURNEY_STAGES} />
      </section>

      {/* ── Certificate ────────────────────────────── */}
      <section className="slider full" id="slider">
        <span className="section-pill light">Certificate</span>
        <h2 className="heading">
          My <span>Credentials</span>
        </h2>
        <div className="cv-medal">
          {CERTIFICATES.map((cert, index) => (
            <InteractiveTiltCard key={index} className={`box-medal${index + 1}`}>
              <div className="medal-icon">
                <span className="material-symbols-outlined" style={{ color: "#111", fontSize: "40px" }}>
                  workspace_premium
                </span>
              </div>
              <div className="medal-meta">{cert.meta}</div>
              <div className="img-medal">
                <img src={cert.img} alt={cert.title} loading="lazy" />
              </div>
              <div className="medal-h2">
                <h2>{cert.title}</h2>
              </div>
              <div className="medal-p">
                <p>{cert.desc}</p>
              </div>
            </InteractiveTiltCard>
          ))}
        </div>
      </section>

      {/* ── Portfolio (Aceternity Hover Image Links) ─────── */}
      <section className="projek full" id="projek">
        <span className="section-pill dark">Portfolio</span>
        <h2 className="heading dark-heading">
          Selected <em>projects</em>
        </h2>
        <HoverImageLinks projects={PORTFOLIO_PROJECTS} />
      </section>

      {/* ── Chat Room ──────────────────────────────── */}
      <section className="chat full" id="chat">
        <span className="section-pill light">Chat</span>
        <h2 className="heading">
          Public <span>Chat Room</span>
        </h2>
        <div className="chat-container glass">
          <div className="chat-wrapper">
            <div id="chat-panel" className="chat-state-panel active">
              <div className="chat-header-user">
                {currentUser ? (
                  <div className="user-info">
                    <img
                      src={currentUser.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=guest"}
                      alt="Avatar"
                      className="user-avatar-img"
                    />
                    <div className="user-details">
                      <span className="user-name-txt">{currentUser.displayName || "Anonymous"}</span>
                      <span className="user-status-txt">
                        <span className="status-dot"></span>Online
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="user-info">
                    <div className="user-avatar-placeholder">
                      <i className="bx bx-group"></i>
                    </div>
                    <div className="user-details">
                      <span className="user-name-txt">Public Chat Room</span>
                      <span className="user-status-txt">
                        <span className="status-dot"></span>Guest Mode
                      </span>
                    </div>
                  </div>
                )}
                <div className="chat-header-actions">
                  {currentUser ? (
                    <button className="btn-logout-clean" type="button" onClick={handleLogout}>
                      <i className="bx bx-log-out"></i> Sign Out
                    </button>
                  ) : (
                    <button className="btn-google-header" type="button" onClick={handleGoogleLogin}>
                      <svg className="google-svg" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="chat-messages-area" ref={chatMessagesRef}>
                {chatLoading ? (
                  <div className="chat-loader">
                    <div className="spinner"></div>
                    <p>Memuat pesan...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty">
                    <i className="bx bx-message-rounded-x"></i>
                    <p>Belum ada pesan. Jadilah yang pertama mengirim pesan!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine =
                      currentUser &&
                      (m.senderName === currentUser.displayName || m.senderName === currentUser.email);
                    const timeStr = m.timestamp?.toDate
                      ? m.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "Baru saja";

                    return (
                      <div
                        key={m.id}
                        className={`chat-bubble ${isMine ? "mine" : ""} ${!currentUser ? "preview-chat" : ""}`}
                      >
                        <img
                          src={m.senderPhoto || "https://api.dicebear.com/7.x/adventurer/svg?seed=guest"}
                          alt={m.senderName}
                          className="bubble-avatar"
                          referrerPolicy="no-referrer"
                        />
                        <div className="bubble-content">
                          <div className="bubble-meta">
                            <span className="bubble-sender">{m.senderName}</span>
                            <span className="bubble-time">{timeStr}</span>
                          </div>
                          <div className="bubble-text-box">
                            <p>{m.messageText}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form className="chat-input-form" onSubmit={handleSendMessage}>
                {currentUser ? (
                  <div className="chat-input-inner-wrapper" style={{ width: "100%" }}>
                    <input
                      type="text"
                      placeholder="Tulis pesan Anda di sini..."
                      maxLength={200}
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                      required
                      autoComplete="off"
                    />
                    <div className="chat-input-actions">
                      <span className={`char-counter ${chatText.length >= 180 ? "limit-warn" : ""}`}>
                        {chatText.length} / 200
                      </span>
                      <button type="submit" className="btn-send" disabled={!chatText.trim()}>
                        <i className="bx bxs-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="chat-input-blocked-msg" style={{ width: "100%" }}>
                    <p>Silakan login dengan Google untuk ikut bergabung dalam obrolan...</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────── */}
      <section className="contact full" id="contact">
        <span className="section-pill dark">Contact</span>
        <h2 className="heading dark-heading">
          Let's <em>Connect</em>
        </h2>
        <div className="contact-cards">
          {[
            { class: "whatsapp", pill: "WhatsApp", handle: "+62 821-1176-2085", desc: "Direct message for quick queries", href: "https://wa.me/6282111762085" },
            { class: "github", pill: "GitHub", handle: "github.com/RakhaFR", desc: "Explore my source code and repositories", href: "https://github.com/RakhaFR/" },
            { class: "discord", pill: "Discord", handle: "bangriyadi", desc: "Chat over Discord anytime", href: "https://discord.com/users/1274191390246440981" },
          ].map((c, i) => (
            <InteractiveTiltCard key={i} className={`contact-card ${c.class}`}>
              <span className="contact-pill">{c.pill}</span>
              <div className="contact-handle">{c.handle}</div>
              <p>{c.desc}</p>
              <a href={c.href} target="_blank" rel="noreferrer" className="btn-card">
                Open →
              </a>
            </InteractiveTiltCard>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer>
        <div className="footer">
          <a href="#home-content" className="footer-logo">
            Rakha<span>.</span>
          </a>
          <p>© 2026 Rakha Fadilah Riyadi — All Rights Reserved</p>
          <div className="footer-links">
            <a href="https://github.com/RakhaFR/" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.instagram.com/bang_r1yad1/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/6282111762085" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
