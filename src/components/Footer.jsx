import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(footerRef.current,
      { opacity: 0 },
      {
        opacity: 1, duration: 1, ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <footer ref={footerRef}>
      <div className="footer">
        <p>
          © {new Date().getFullYear()} Rakha Fadilah Riyadi — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
