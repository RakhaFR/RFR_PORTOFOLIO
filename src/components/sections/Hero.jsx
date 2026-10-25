import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
// Local Inline SVGs for Cyberpunk Theme to ensure robust rendering without cache issues
const TerminalIcon = ({ className, size = 24 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const Github = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
  </svg>
);

const Globe = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const Code = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const Cpu = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
  </svg>
);

const ExternalLink = ({ className, size = 16 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Activity = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const BadgeCheck = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 11 13 15 9" />
  </svg>
);

const MapPin = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Layers = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polygon points="2 17 12 22 22 17" />
    <polygon points="2 12 12 17 22 12" />
  </svg>
);

gsap.registerPlugin(useGSAP, ScrollTrigger);

const splitText = (text, isHighlight = false) => {
  return text.split(" ").map((word, wIdx) => (
    <span key={wIdx} className="word-mask" style={{ marginRight: "0.2em" }}>
      {word.split("").map((char, cIdx) => (
        <span key={cIdx} className={`char-wrap ${isHighlight ? "highlight" : ""}`}>
          {char}
        </span>
      ))}
    </span>
  ));
};

export default function Hero() {
  const sectionRef   = useRef(null);
  const canvasRef    = useRef(null);
  const h1Ref        = useRef(null);
  const subtitleRef  = useRef(null);
  const speedRef     = useRef({ val: 1 });

  // Refs for Bento Panels to animate individually
  const panel1Ref = useRef(null);
  const panel2Ref = useRef(null);
  const panel3Ref = useRef(null);
  const panel4Ref = useRef(null);
  const panel5Ref = useRef(null);

  // Profile image hover parallax refs
  const profileCardRef = useRef(null);
  const profileImgRef  = useRef(null);

  /* ── GSAP useGSAP Hook for Entry and Scroll-Driven Bento Grid Animation ── */
  useGSAP((context, contextSafe) => {
    const chars = context.selector(".char-wrap");

    // ─── PAGE LOAD: Staggered entry from different angles ───
    const introTl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1.2 }
    });

    introTl
      // Panel 1 (Main content) slides in from Left
      .fromTo(panel1Ref.current, 
        { x: -150, autoAlpha: 0 }, 
        { x: 0, autoAlpha: 1 }
      )
      // Panel 2 (Profile Pic) slides in from Right
      .fromTo(panel2Ref.current, 
        { x: 150, autoAlpha: 0 }, 
        { x: 0, autoAlpha: 1 }, 
        "<0.2"
      )
      // Panel 3 (Tech Stack) slides in from Bottom
      .fromTo(panel3Ref.current, 
        { y: 100, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1 }, 
        "<0.15"
      )
      // Panel 4 (Stats) slides in from Bottom
      .fromTo(panel4Ref.current, 
        { y: 100, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1 }, 
        "<0.15"
      )
      // Panel 5 (Code Terminal) scales up
      .fromTo(panel5Ref.current, 
        { scale: 0.8, autoAlpha: 0 }, 
        { scale: 1, autoAlpha: 1, ease: "back.out(1.4)" }, 
        "<0.2"
      )
      // Staggered characters reveal within Panel 1
      .fromTo(chars, 
        { y: "100%" }, 
        { y: "0%", duration: 1, stagger: 0.02 }, 
        "-=1.0"
      );

    // ─── SCROLLTRIGGER: Pinning + Explode / Scatter Effect ───
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%", // Hold screen for 1.5x scroll height
        pin: true,
        scrub: 1,
      }
    });

    scrollTl
      // Panel 1 (Main brand) explodes Left
      .to(panel1Ref.current, { x: -1000, y: -200, rotation: -15, scale: 0.6, autoAlpha: 0, ease: "power2.inOut" }, 0)
      // Panel 2 (Profile) explodes Right + scales up/down
      .to(panel2Ref.current, { x: 1000, y: 100, rotation: 15, scale: 0.7, autoAlpha: 0, ease: "power2.inOut" }, 0)
      // Panel 3 (Tech stack) scatters Bottom-Left
      .to(panel3Ref.current, { x: -600, y: 600, rotation: -30, autoAlpha: 0, ease: "power2.inOut" }, 0)
      // Panel 4 (Stats) scatters Bottom-Right
      .to(panel4Ref.current, { x: 600, y: 600, rotation: 30, autoAlpha: 0, ease: "power2.inOut" }, 0)
      // Panel 5 (Terminal) implodes / shrinks down
      .to(panel5Ref.current, { scale: 0.1, rotation: 45, autoAlpha: 0, ease: "power2.inOut" }, 0)
      // Three.js Hyperspace warp speed trigger
      .to(speedRef.current, { val: 40, ease: "power3.in" }, 0)
      // Three.js container transition
      .to(canvasRef.current, { autoAlpha: 0, ease: "power2.in" }, 0.5);

    // ─── 3D Mouse Parallax on Profile Photo Panel ───
    const profileCard = profileCardRef.current;
    const profileImg = profileImgRef.current;

    const onProfileMouseMove = contextSafe((e) => {
      if (!profileCard || !profileImg) return;
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const dx = (x - xc) / xc; // Normalized position (-1 to 1)
      const dy = (y - yc) / yc;

      // Subtle 3D Card rotation
      gsap.to(profileCard, {
        rotationY: dx * 12,
        rotationX: -dy * 12,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.4
      });

      // Opposite image shift for depth parallax
      gsap.to(profileImg, {
        x: -dx * 16,
        y: -dy * 16,
        ease: "power2.out",
        duration: 0.4
      });
    });

    const onProfileMouseLeave = contextSafe(() => {
      if (!profileCard || !profileImg) return;
      gsap.to([profileCard, profileImg], {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        ease: "power3.out",
        duration: 0.8
      });
    });

    if (profileCard) {
      profileCard.addEventListener("mousemove", onProfileMouseMove);
      profileCard.addEventListener("mouseleave", onProfileMouseLeave);
    }

    return () => {
      if (profileCard) {
        profileCard.removeEventListener("mousemove", onProfileMouseMove);
        profileCard.removeEventListener("mouseleave", onProfileMouseLeave);
      }
    };
  }, { scope: sectionRef });

  /* ── Three.js Particle System (Hyperspace engine) ── */
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const count     = 1500; // slightly dense particles
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const c1 = new THREE.Color("#00c8ff");
    const c2 = new THREE.Color("#00ffc8");

    for (let i = 0; i < count * 3; i += 3) {
      positions[i]   = (Math.random() - 0.5) * 12;
      positions[i+1] = (Math.random() - 0.5) * 12;
      positions[i+2] = (Math.random() - 0.5) * 12;
      const mix = c1.clone().lerp(c2, Math.random());
      colors[i] = mix.r; colors[i+1] = mix.g; colors[i+2] = mix.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors,    3));

    const canvas2d = document.createElement("canvas");
    canvas2d.width = canvas2d.height = 16;
    const ctx  = canvas2d.getContext("2d");
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const mat = new THREE.PointsMaterial({
      size: 0.045, vertexColors: true, transparent: true, opacity: 0.8,
      map: new THREE.CanvasTexture(canvas2d),
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    const onMouse = (e) => {
      mouseX = (e.clientX - halfW) * 0.0008;
      mouseY = (e.clientY - halfH) * 0.0008;
    };
    window.addEventListener("mousemove", onMouse);

    const clock = new THREE.Clock();
    let raf;
    let accumulatedTime = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      
      const speedMult = speedRef.current.val;
      accumulatedTime += delta * speedMult;
      
      points.rotation.y = accumulatedTime * 0.04;
      points.rotation.x = accumulatedTime * 0.015;
      
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      points.rotation.y += targetX * 0.4;
      points.rotation.x += targetY * 0.4;
      
      // Dynamic warp FOV
      camera.fov = 75 + (speedMult - 1) * 1.5;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden bg-[#020c14]" id="home-content" ref={sectionRef}>
      {/* Dynamic 3D Particle Space Background */}
      <div id="hero-3d-container" className="absolute inset-0 z-0 pointer-events-none" ref={canvasRef} />

      {/* Premium Cyberpunk Bento-Grid Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl mx-auto z-10 relative">
        
        {/* PANEL 1: Main Branding (Large) */}
        <div ref={panel1Ref} className="cyber-panel p-8 md:col-span-2 md:row-span-2 flex flex-col justify-between min-h-[400px] rounded-3xl">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-none mb-4" ref={h1Ref}>
              {splitText("RAKHA")} {splitText("FADILAH", true)}
            </h1>
            <h2 className="text-xl md:text-2xl font-mono text-cyan-400 font-semibold tracking-wider mb-6 flex items-center gap-2" ref={subtitleRef}>
              <TerminalIcon size={24} className="animate-pulse" />
              Junior Web Developer
            </h2>
            <p className="text-base text-[#7ea8c4] leading-relaxed max-w-xl mb-8">
              Hi there, I am a front-end engineer based in Bogor. I construct clean, high-performance web products, merging standard structures with high-fidelity creative visuals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-cyan-500/10">
            <div className="btn-box">
              <a href="#contact" className="relative group overflow-hidden">
                <span className="flex items-center gap-2">
                  Contact Me <ExternalLink size={16} />
                </span>
              </a>
            </div>
            
            {/* Direct Social Links (Inline SVGs) */}
            <div className="flex items-center gap-4">
              <a href="https://github.com/RakhaFR/" target="_blank" rel="noreferrer" className="text-[#7ea8c4] hover:text-cyan-400 transition-colors p-2 rounded-xl bg-cyan-950/20 border border-cyan-500/10">
                <Github size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100084701316322" target="_blank" rel="noreferrer" className="text-[#7ea8c4] hover:text-cyan-400 transition-colors p-2 rounded-xl bg-cyan-950/20 border border-cyan-500/10">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/bang_r1yad1/" target="_blank" rel="noreferrer" className="text-[#7ea8c4] hover:text-cyan-400 transition-colors p-2 rounded-xl bg-cyan-950/20 border border-cyan-500/10">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://wa.me/6282111762085" target="_blank" rel="noreferrer" className="text-[#7ea8c4] hover:text-cyan-400 transition-colors p-2 rounded-xl bg-cyan-950/20 border border-cyan-500/10">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* PANEL 2: Interactive 3D Photo Mask Panel */}
        <div ref={panel2Ref} className="cyber-panel md:col-span-1 md:row-span-2 flex items-center justify-center p-6 min-h-[350px] rounded-3xl" style={{ perspective: 1000 }}>
          <div 
            ref={profileCardRef} 
            className="relative w-full h-full min-h-[300px] flex items-center justify-center rounded-2xl overflow-hidden bg-cyan-950/10 border border-cyan-500/10 cursor-pointer shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#020c14] via-transparent to-transparent z-10" />
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#020c14]/70 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/20">
              <Activity size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-cyan-400">TARGET: DETECTED</span>
            </div>
            
            <img 
              ref={profileImgRef}
              src="/img/hero.jpeg" 
              alt="Rakha Fadilah" 
              className="absolute w-[110%] h-[110%] object-cover cyber-img-mask"
            />
          </div>
        </div>

        {/* PANEL 3: Tech Stack Panel (Glass/Neon Card) */}
        <div ref={panel3Ref} className="cyber-panel p-6 rounded-3xl cyber-panel-glow-green">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={20} className="text-emerald-400" />
            <h3 className="font-mono text-sm tracking-wider text-emerald-400 font-bold">TECH CAPABILITIES</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 bg-[#020c14]/50 p-2 rounded-xl border border-emerald-500/10 hover:border-emerald-400/30 transition-all">
              <Code size={14} className="text-emerald-400" /> React / JS
            </div>
            <div className="flex items-center gap-2 bg-[#020c14]/50 p-2 rounded-xl border border-emerald-500/10 hover:border-emerald-400/30 transition-all">
              <Layers size={14} className="text-emerald-400" /> Tailwind CSS
            </div>
            <div className="flex items-center gap-2 bg-[#020c14]/50 p-2 rounded-xl border border-emerald-500/10 hover:border-emerald-400/30 transition-all">
              <TerminalIcon size={14} className="text-emerald-400" /> Node.js / Git
            </div>
            <div className="flex items-center gap-2 bg-[#020c14]/50 p-2 rounded-xl border border-emerald-500/10 hover:border-emerald-400/30 transition-all">
              <Globe size={14} className="text-emerald-400" /> Web APIs
            </div>
          </div>
        </div>

        {/* PANEL 4: Stats Panel */}
        <div ref={panel4Ref} className="cyber-panel p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck size={20} className="text-cyan-400" />
            <h3 className="font-mono text-sm tracking-wider text-cyan-400 font-bold">RECORDS & STATISTICS</h3>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-center flex-1">
              <p className="text-3xl font-black text-cyan-400 leading-none">15+</p>
              <p className="text-[10px] font-mono text-[#7ea8c4] mt-1">PROJECTS COMPLETED</p>
            </div>
            <div className="w-[1px] h-10 bg-cyan-500/10" />
            <div className="text-center flex-1">
              <p className="text-3xl font-black text-cyan-400 leading-none">1+</p>
              <p className="text-[10px] font-mono text-[#7ea8c4] mt-1">YEAR ACTIVE</p>
            </div>
          </div>
        </div>

        {/* PANEL 5: Cyber Terminal Console Panel */}
        <div ref={panel5Ref} className="cyber-panel p-6 rounded-3xl md:col-span-1 min-h-[140px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/10">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-[9px] font-mono text-cyan-400">rkf@server-node: ~</span>
          </div>
          <div className="mt-3 flex-1 font-mono text-[10px] text-cyan-400/80 leading-relaxed space-y-1">
            <p className="flex items-center gap-1.5"><span className="text-[#7ea8c4]">$</span> status: online</p>
            <p className="flex items-center gap-1.5"><span className="text-[#7ea8c4]">$</span> location: <MapPin size={10} /> Bogor, ID</p>
            <p className="flex items-center gap-1.5"><span className="text-[#7ea8c4]">$</span> modules: active_threejs, gsap_scrub_v3</p>
          </div>
        </div>

      </div>
    </section>
  );
}
