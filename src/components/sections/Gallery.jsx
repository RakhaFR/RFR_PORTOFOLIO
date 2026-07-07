import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const THUMBS = [
  { src: "/img/hero.jpeg",           title: "Profil Saya",          desc: "Foto Saya di depan kaca hotel",                               category: "portfolio" },
  { src: "/img/Rakha.jpg",           title: "Aku Suka Ngoding",     desc: "Photo yang menunjukkan awal mulai nya suka di programming",    category: "portfolio" },
  { src: "/img/zoomDigiup2025.png",  title: "Zoom Telkom Digiup 2025", desc: "Pelatihan web development with laravel bersama Telkom Digiup 2025", category: "kegiatan" },
  { src: "/img/ngodingDiKelas.jpg",  title: "Ngoding di kelas",     desc: "Gak tau siapa yang motret ini?!",                             category: "kegiatan" },
  { src: "/img/Nevtik.jpg",          title: "Ekskul Nevtik Fase 2", desc: "Tahap yang lumayan pusing. Mau masuk konsep OOP JavaScript!", category: "kegiatan" },
];

const POPUP_ITEMS = [
  { src: "/img/Takanashi_Hoshino.jpg", title: "My Luv",            desc: "\"Sst jangan kasih tau 🤫\"" },
  { src: "/img/ToBeHeroX.jpg",         title: "Donghua TO BE HERO X", desc: "Salah Satu Anime Donghua yang KECE BADAI" },
];

export default function Gallery() {
  const [category,    setCategory]    = useState("all");
  const [popupOpen,   setPopupOpen]   = useState(false);
  const [previewSrc,  setPreviewSrc]  = useState("/img/hero.jpeg");
  const [previewDesc, setPreviewDesc] = useState("Foto Saya di depan kaca hotel");

  const headingRef  = useRef(null);
  const previewRef  = useRef(null);
  const thumbsRef   = useRef(null);
  const thumbRefs   = useRef([]);

  const filtered = category === "all"
    ? THUMBS
    : THUMBS.filter((t) => t.category === category);

  // Click thumb → update preview
  const handleThumbClick = (item) => {
    gsap.to(previewRef.current.querySelector("img"), {
      opacity: 0, scale: 0.95, duration: 0.25,
      onComplete: () => {
        setPreviewSrc(item.src);
        setPreviewDesc(item.desc);
        gsap.to(previewRef.current.querySelector("img"), { opacity: 1, scale: 1, duration: 0.35 });
      },
    });
  };

  // GSAP ScrollTrigger entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );

      gsap.fromTo(previewRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: previewRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
      );

      gsap.fromTo(thumbsRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: thumbsRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
      );
    });
    return () => ctx.revert();
  }, []);

  // Animate thumbs on filter change
  useEffect(() => {
    const items = thumbRefs.current.filter(Boolean);
    gsap.fromTo(items,
      { y: 20, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.07, ease: "power2.out" }
    );
  }, [category]);

  return (
    <section className="gallery full" id="gallery">
      <h2 className="heading" ref={headingRef}>GALLERY</h2>

      <div className="gallery-container">
        {/* Main preview */}
        <div className="gallery-preview" ref={previewRef}>
          <img src={previewSrc} alt="Gallery Preview" />
          <p>{previewDesc}</p>
        </div>

        {/* Thumbs + filter */}
        <div className="gallery-thumbs" ref={thumbsRef}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Category All</option>
            <option value="portfolio">My Gallery</option>
            <option value="kegiatan">Kegiatan</option>
            <option value="acara">Acara</option>
          </select>

          <div className="thumb-grid">
            {filtered.map((item, i) => (
              <div
                key={item.src}
                className="thumb"
                ref={(el) => (thumbRefs.current[i] = el)}
                onClick={() => handleThumbClick(item)}
                style={{ cursor: "pointer" }}
              >
                <img src={item.src} alt={item.title} />
                <div className="overlay">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-more"
            onClick={() => {
              setPopupOpen(true);
              gsap.fromTo(".popup-gallery", { opacity: 0 }, { opacity: 1, duration: 0.35 });
            }}
          >
            MORE →
          </button>
        </div>
      </div>

      {/* Popup */}
      <div
        className={`popup-gallery${popupOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setPopupOpen(false); }}
      >
        <div className="popup-content">
          <span className="close" onClick={() => setPopupOpen(false)}>&times;</span>
          <div className="popup-grid">
            {POPUP_ITEMS.map((item) => (
              <div key={item.src} className="popup-item">
                <img src={item.src} alt={item.title} />
                <div className="overlay">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
