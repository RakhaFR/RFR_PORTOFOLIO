import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CERTS = [
  {
    img: "/img/Sertifikat Digiup 2025/Sertifikat_digiup_page-0001.jpg",
    title: "Sertifikat Digiup 2025",
    desc: "Ini adalah Sertifikat pertamaku dalam fase menjadi junior developer. Aku sangat senang karena ini adalah sertifikat dari Telkom Indonesia.",
  },
];

export default function Certificate() {
  const headingRef = useRef(null);
  const cardsRef   = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.9, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="slider full" id="slider">
      <h2 className="heading" ref={headingRef}>
        My <span>Certificate</span>
      </h2>
      <div className="cv-medal">
        {CERTS.map((cert, i) => (
          <div
            key={cert.title}
            className="box-medal1"
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <div className="img-medal">
              <img src={cert.img} alt={cert.title} />
            </div>
            <div className="medal-h2">
              <h2>{cert.title}</h2>
            </div>
            <div className="medal-p">
              <p>{cert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
