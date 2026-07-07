import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CONTACTS = [
  {
    className: "contact-card whatsapp",
    img: "/ui/img/whatsapp-icon.svg",
    title: "WhatsApp",
    desc: "Hubungi saya langsung melalui WhatsApp untuk diskusi cepat.",
    btnLabel: "Chat Sekarang",
    href: "https://wa.me/6282111762085",
  },
  {
    className: "contact-card discord",
    img: "/ui/img/discord-icon.svg",
    title: "Discord",
    desc: "Temukan saya di Discord untuk kolaborasi atau sekedar ngobrol.",
    btnLabel: "Add Discord",
    href: "https://discord.com/users/1274191390246440981",
  },
  {
    className: "contact-card github",
    img: "/ui/img/github-icon.png",
    title: "GitHub",
    desc: "Lihat semua proyek dan kontribusi open source saya di GitHub.",
    btnLabel: "Lihat GitHub",
    href: "https://github.com/RakhaFR/",
  },
];

function ContactCard({ className, img, title, desc, btnLabel, href }) {
  const cardRef = useRef(null);

  // Set transform origin once on mount — prevents "stuck tilt" on first render
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.set(card, { transformOrigin: "center center", transformPerspective: 800 });
  }, []);

  // Card tilt GSAP
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      gsap.to(card, {
        rotateX: -dy * 4,
        rotateY:  dx * 4,
        y: -8,
        duration: 0.15,
        ease: "none",
        overwrite: "auto",
      });
    };

    const onLeave = () =>
      gsap.to(card, {
        rotateX: 0, rotateY: 0, y: 0,
        duration: 0.5, ease: "power2.out",
        overwrite: "auto",
      });

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Entrance — once only, no reverse so tilt state gak keoverride
  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          toggleActions: "play none none none", // ← ganti: no reverse
        },
      }
    );
  }, []);

  return (
    <div className={className} ref={cardRef}>
      <img src={img} alt={title} />
      <h3>{title}</h3>
      <p>{desc}</p>
      <a href={href} className="btn-card" target="_blank" rel="noreferrer">
        {btnLabel}
      </a>
    </div>
  );
}

export default function Contact() {
  const headingRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(headingRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section className="contact" id="contact">
      <h2 className="heading" ref={headingRef}>
        Contact <span>Me</span>
      </h2>
      <div className="contact-cards">
        {CONTACTS.map((c) => (
          <ContactCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}