import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    img:  "/img/PlengerRng.jpg",
    name: "Plenger RnG",
    desc: "Sebuah permainan gacha simpel untuk mendapatkan muka-muka lucu dan kocak dengan rarity yang berbeda-beda.",
    url:  "https://rakhafr.github.io/PlengerRnG/",
  },
  {
    img:  "/img/ReflexGame.png",
    name: "Reflex Hands Games",
    desc: "Permainan yang menguji kecepatan dan ketepatan tangan Anda dengan berbagai tantangan reflex.",
    url:  "https://rakhafr.github.io/Reflex-Game/",
  },
  {
    img:  "/img/TheSurvey.png",
    name: "The Survey",
    desc: "Sebuah visual novel yang menceritakan seorang yang berjuang keluar dari isolasi diri selama 8 bulan.",
    url:  "https://rakhafr.github.io/TheSurvey/",
  },
  {
    img:  "/img/boostrap-template-class.png",
    name: "boostrap-template-custom-class",
    desc: "Kumpulan komponen dan halaman template Bootstrap 5.3 yang lengkap, siap pakai, dan bisa dijalankan 100% offline.",
    url:  "https://rakhafr.github.io/Boostrap-template-class/",
  },
];

function ProjectCard({ img, name, desc, url }) {
  const cardRef = useRef(null);

  // Tilt hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.set(card, { transformOrigin: "center center", transformPerspective: 800 });

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      gsap.to(card, { rotateX: -dy * 4, rotateY: dx * 4, y: -10, duration: 0.15, ease: "none", overwrite: "auto" });
    };
    const onLeave = () => gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); };
  }, []);

  // Entrance
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 88%", toggleActions: "play none none reverse" } }
    );
  }, []);

  return (
    <div className="card" ref={cardRef}>
      <div className="image">
        <img src={img} alt={name} />
      </div>
      <div className="content">
        <h2>{name}</h2>
        <p>{desc}</p>
        <a href={url} className="btn" target="_blank" rel="noreferrer">Go To Website</a>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
    );
  }, []);

  return (
    <section className="projek full" id="projek">
      <h2 className="heading" style={{ marginBottom: "5rem" }} ref={headingRef}>
        My <span>Portfolio</span>
      </h2>
      <div className="cv-blog">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.name} {...p} />
        ))}
      </div>
    </section>
  );
}