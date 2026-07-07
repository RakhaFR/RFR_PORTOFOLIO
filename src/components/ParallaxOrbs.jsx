import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ORB_CONFIG = [
  { parent: ".home-content",  top: "15%", left: "60%", size: 400, color: "0,200,255", opacity: 0.12 },
  { parent: ".home-content",  top: "60%", left: "80%", size: 250, color: "0,255,200", opacity: 0.07 },
  { parent: ".about",         top: "10%", left: "-10%", size: 450, color: "0,200,255", opacity: 0.08 },
  { parent: ".gallery",       top: "30%", left: "70%", size: 350, color: "0,255,200", opacity: 0.07 },
  { parent: ".skill",         top: "50%", left: "-5%", size: 380, color: "0,200,255", opacity: 0.08 },
  { parent: ".projek",        top: "20%", left: "75%", size: 320, color: "0,255,200", opacity: 0.07 },
];

export default function ParallaxOrbs() {
  useEffect(() => {
    const orbs = [];

    ORB_CONFIG.forEach(({ parent, top, left, size, color, opacity }) => {
      const section = document.querySelector(parent);
      if (!section) return;

      const orb = document.createElement("div");
      orb.className = "parallax-orb";
      orb.style.cssText = `
        top:${top}; left:${left};
        width:${size}px; height:${size}px;
        background: radial-gradient(circle, rgba(${color},${opacity}) 0%, transparent 65%);
        pointer-events:none;
        position:absolute;
        border-radius:50%;
        filter:blur(70px);
        will-change:transform;
        z-index:0;
      `;
      const speed = (Math.random() * 0.12 + 0.06).toFixed(3);
      orb.dataset.speed = speed;

      section.insertBefore(orb, section.firstChild);
      orbs.push(orb);

      // GSAP ScrollTrigger scrub parallax per orb
      gsap.to(orb, {
        y: () => {
          const s = document.querySelector(parent);
          return s ? s.offsetHeight * parseFloat(speed) * -1 : 0;
        },
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      orbs.forEach((orb) => orb.parentElement?.removeChild(orb));
    };
  }, []);

  return null; // purely side-effect component
}
