import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

const SOCIALS = [
  { href: "https://www.facebook.com/profile.php?id=100084701316322", name: "Facebook", src: "/ui/img/facebook-icon.svg" },
  { href: "http://tiktok.com/@xzearty_",                            name: "TikTok",   src: "/ui/img/tiktok-icon.svg" },
  { href: "https://www.instagram.com/bang_r1yad1/",                 name: "Instagram",src: "/ui/img/instagram-icon.svg" },
  { href: "https://wa.me/6282111762085",                            name: "WhatsApp", src: "/ui/img/whatsapp-icon.svg" },
  { href: "https://lynk.id/bangriyadi/s/z6l332ojeqrg",             name: "Support Me",src: "/ui/img/lynkId-icon.png" },
  { href: "https://discord.com/users/1274191390246440981",          name: "Discord",  src: "/ui/img/discord-icon.svg" },
  { href: "https://github.com/RakhaFR/",                            name: "GitHub",   src: "/ui/img/github-icon.png" },
];

export default function Hero() {
  const sectionRef  = useRef(null);
  const blobRef     = useRef(null);
  const canvasRef   = useRef(null);
  const h1Ref       = useRef(null);
  const subtitleRef = useRef(null);
  const paraRef     = useRef(null);
  const btnRef      = useRef(null);
  const socialRef   = useRef(null);

  /* ── GSAP entrance animations ── */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(h1Ref.current,       { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9 })
      .fromTo(subtitleRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, "-=0.5")
      .fromTo(paraRef.current,     { y:  30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
      .fromTo(btnRef.current,      { x:  60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, "-=0.5")
      .fromTo(
        socialRef.current.querySelectorAll(".social"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07 },
        "-=0.3"
      )
      .fromTo(blobRef.current, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1,0.6)" }, "-=1");
  }, []);

  /* ── Blob mousemove parallax ── */
  useEffect(() => {
    const section = sectionRef.current;
    const blob    = blobRef.current;
    if (!section || !blob) return;

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      gsap.to(blob, { x: dx * 14, y: dy * 10, duration: 0.15, ease: "none" });
    };
    const onLeave = () => gsap.to(blob, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── Three.js particle system ── */
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

    const count     = 1200;
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
      size: 0.04, vertexColors: true, transparent: true, opacity: 0.75,
      map: new THREE.CanvasTexture(canvas2d),
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    const onMouse = (e) => {
      mouseX = (e.clientX - halfW) * 0.001;
      mouseY = (e.clientY - halfH) * 0.001;
    };
    window.addEventListener("mousemove", onMouse);

    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.05;
      points.rotation.x = t * 0.02;
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      points.rotation.y += targetX * 0.5;
      points.rotation.x += targetY * 0.5;
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
    <section className="home-content full" id="home-content" ref={sectionRef}>
      <div id="hero-3d-container" ref={canvasRef} />

      <div className="content">
        <h1 ref={h1Ref}>
          Rakha <span className="highlight">Fadilah</span>
        </h1>
        <h2 className="engineer" ref={subtitleRef}>Junior Web Developer</h2>
        <p ref={paraRef}>
          Hello, I'm a Front-End Developer from Bogor, West Java. I have 1 year of experience building
          clean, functional, and visually engaging websites. I treat code as craft — let's build something great together.
        </p>
        <div className="btn-box" ref={btnRef}>
          <a href="#contact"><span>Contact Me</span></a>
        </div>
        <div className="home-sci" ref={socialRef}>
          {SOCIALS.map(({ href, name, src }) => (
            <a key={name} href={href} className="social" data-name={name} target="_blank" rel="noreferrer">
              <img src={src} alt={name} />
            </a>
          ))}
        </div>
      </div>

      <div className="content margin-top">
        <div className="blob-frame" ref={blobRef}>
          <img src="/img/hero.jpeg" alt="Foto Profil" />
        </div>
      </div>
    </section>
  );
}
