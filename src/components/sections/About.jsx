import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const blobRef    = useRef(null);
  const titleRef   = useRef(null);
  const boxRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Blob slides in from left
      gsap.fromTo(blobRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: blobRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Title slides in from right
      gsap.fromTo(titleRef.current,
        { x: 100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 80%", toggleActions: "play none none reverse" },
        }
      );

      // Text box fades up
      gsap.fromTo(boxRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: boxRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );

      // Scroll parallax on about title
      gsap.to(titleRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about full" id="about" ref={sectionRef}>
      <div className="container">
        <div className="sub-main">
          <div className="blob-frame" ref={blobRef}>
            <img src="/img/Rakha.jpg" alt="Foto Profil" />
          </div>
          <h2 ref={titleRef}>
            About <span>Me</span>
          </h2>
        </div>
        <div className="text-float">
          <div className="text-box" ref={boxRef}>
            <p>
              My name is Rakha Fadilah Riyadi. I'm a front-end web developer from Bogor, West Java,
              with one year of hands-on experience. In my opinion, building software is not just a job —
              it's an art form with aesthetic value. My goal is to craft websites that are functional,
              user-friendly, and visually memorable. I put a personal touch into every project to ensure
              the final product truly reflects your brand identity. If you're interested in working together,
              feel free to reach out!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
