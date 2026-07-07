import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  { icon: "/ui/img/html-icon.png",      name: "HTML",          pct: 95, desc: "Struktur dasar halaman web menggunakan elemen semantic dan best practice." },
  { icon: "/ui/img/css-icon.svg",       name: "CSS",           pct: 90, desc: "Mendesain layout, animasi, dan tampilan website responsif dengan CSS." },
  { icon: "/ui/img/js-icon.svg",        name: "JavaScript",    pct: 65, desc: "Menambahkan interaktivitas, manipulasi DOM, dan logika front-end dasar." },
  { icon: "/ui/img/php-icon.svg",       name: "PHP",           pct: 40, desc: "Bahasa server-side untuk membangun website dinamis dan koneksi database." },
  { icon: "/ui/img/boostrap-icon.svg",  name: "Bootstrap 5",   pct: 45, desc: "Framework CSS untuk membuat tampilan web cepat, responsif, dan modern." },
  { icon: "/ui/img/tailwind-icon.png",  name: "Tailwind CSS",  pct: 80, desc: "Framework CSS utility-first yang populer untuk membangun UI secara cepat dan kustom." },
  { icon: "/ui/img/Laravel-icon.svg",   name: "Laravel",       pct: 30, desc: "Framework PHP open-source dengan pola MVC untuk mempermudah pengembangan web." },
];

function SkillCard({ icon, name, pct, desc }) {
  const cardRef = useRef(null);
  const barRef  = useRef(null);

  // Bar animate on scroll
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    ScrollTrigger.create({
      trigger: bar,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.fromTo(bar, { width: "0%" }, {
          width: pct + "%",
          duration: 1.4,
          ease: "power2.out",
        });
      },
    });
  }, [pct]);

  // Card tilt on hover using GSAP
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, { transformOrigin: "center center", transformPerspective: 800 });

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      gsap.to(card, {
        rotateX: -dy * 4, rotateY: dx * 4,
        y: -10,
        duration: 0.15, ease: "none",
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Card entrance
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 88%", toggleActions: "play none none reverse" },
      }
    );
  }, []);

  return (
    <div className="skill-card glass" ref={cardRef}>
      <div className="card-header">
        <img src={icon} alt={name} />
        <h3>{name}</h3>
      </div>
      <p>{desc}</p>
      <span className="percent">{pct}%</span>
      <div className="bar">
        <span ref={barRef} style={{ width: "0%" }} />
      </div>
    </div>
  );
}

export default function Skills() {
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
    );
  }, []);

  return (
    <section className="skill full" id="skill">
      <h2 className="heading" ref={headingRef}>
        My <span>Skills</span>
      </h2>
      <div className="skill-row">
        {SKILLS.map((s) => (
          <SkillCard key={s.name} {...s} />
        ))}
      </div>
    </section>
  );
}