import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { href: "#home-content", label: "Home" },
  { href: "#about",        label: "About" },
  { href: "#gallery",      label: "Gallery" },
  { href: "#skill",        label: "Skill" },
  { href: "#slider",       label: "Certificate" },
  { href: "#projek",       label: "Portfolio" },
  { href: "#chat",         label: "Chat" },
  { href: "#contact",      label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home-content");
  const headerRef = useRef(null);

  // GSAP: header entrance on load
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  // GSAP: header shrink on scroll
  useEffect(() => {
    const header = headerRef.current;
    ScrollTrigger.create({
      start: "top+=80 top",
      onEnter:  () => gsap.to(header, { paddingTop: "1rem",  paddingBottom: "1rem",  duration: 0.3 }),
      onLeaveBack: () => gsap.to(header, { paddingTop: "1.6rem", paddingBottom: "1.6rem", duration: 0.3 }),
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const handler = () => {
      const scrollY = window.scrollY;
      sections.forEach((sec) => {
        const top    = sec.offsetTop - 130;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          setActiveSection(sec.id);
        }
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (id) => {
    setActiveSection(id.replace("#", ""));
    setMenuOpen(false);
  };

  return (
    <header className="header" ref={headerRef}>
      <a href="#home-content" className="logo">
        Rakha<span style={{ color: "var(--accent)" }}>.</span>
      </a>

      {/* Mobile hamburger */}
      <label
        className="icons"
        onClick={() => setMenuOpen((v) => !v)}
        style={{ cursor: "pointer" }}
      >
        <i className={`bx ${menuOpen ? "bx-x" : "bx-menu"}`} />
      </label>

      <nav className={`navbar${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className={activeSection === href.replace("#", "") ? "active" : ""}
            onClick={() => handleNavClick(href)}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
