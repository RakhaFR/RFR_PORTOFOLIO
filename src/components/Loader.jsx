import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const barRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("loading");

    let progress = 0;
    const tl = gsap.timeline();

    // Fake initial crawl 0 → 30
    tl.to({ val: 0 }, {
      val: 30,
      duration: 1.2,
      ease: "power1.out",
      onUpdate: function () {
        const v = Math.round(this.targets()[0].val);
        if (barRef.current) barRef.current.style.width = v + "%";
        if (percentRef.current) percentRef.current.textContent = v + "%";
        progress = v;
      },
    });

    // Simulate image loading 30 → 100
    tl.to({ val: 30 }, {
      val: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: function () {
        const v = Math.round(this.targets()[0].val);
        if (barRef.current) barRef.current.style.width = v + "%";
        if (percentRef.current) percentRef.current.textContent = v + "%";
      },
      onComplete: () => {
        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: "power2.inOut",
          onComplete: () => {
            if (loaderRef.current) loaderRef.current.style.visibility = "hidden";
            document.body.classList.remove("loading");
            onComplete?.();
          },
        });
      },
    });

    // Safety fallback
    const fallback = setTimeout(() => {
      tl.kill();
      document.body.classList.remove("loading");
      onComplete?.();
    }, 6000);

    return () => {
      tl.kill();
      clearTimeout(fallback);
    };
  }, [onComplete]);

  return (
    <div id="page-loader" ref={loaderRef}>
      <div className="loader-inner">
        {/* SVG gradient defs */}
        <svg height="0" width="0" viewBox="0 0 64 64" className="loader-defs-svg">
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="ld-b">
              <stop stopColor="#00c8ff" />
              <stop stopColor="#00ffc8" offset="1" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="0" x2="0" y1="64" x1="0" id="ld-c">
              <stop stopColor="#00c8ff" />
              <stop stopColor="#00ffc8" offset="1" />
              <animateTransform
                repeatCount="indefinite"
                keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
                keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                dur="8s"
                values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                type="rotate"
                attributeName="gradientTransform"
              />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" y2="2" x2="0" y1="62" x1="0" id="ld-d">
              <stop stopColor="#00ffc8" />
              <stop stopColor="#00c8ff" offset="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* R - a - k - h - a letters */}
        <div className="loader-text">
          {/* R */}
          <svg className="letter-svg" viewBox="0 0 64 64" height="64" width="64" fill="none">
            <path className="dash" stroke="url(#ld-b)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength="360"
              d="M 12,8 L 12,56 M 12,8 L 38,8 C 46,8 52,14 52,22 C 52,30 46,36 38,36 L 12,36 M 34,36 L 52,56" />
          </svg>
          {/* a (spin) */}
          <svg className="letter-svg spin-letter" viewBox="0 0 64 64" height="64" width="64" fill="none">
            <path className="spin" stroke="url(#ld-c)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength="360"
              d="M 48,22 C 48,22 48,56 48,56 M 16,32 C 16,22 22,14 32,14 C 42,14 48,22 48,32 C 48,42 42,50 32,50 C 22,50 16,42 16,32 Z" />
          </svg>
          {/* k */}
          <svg className="letter-svg" viewBox="0 0 64 64" height="64" width="64" fill="none">
            <path className="dash" stroke="url(#ld-b)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength="360"
              d="M 14,8 L 14,56 M 14,32 L 46,8 M 14,32 L 46,56" />
          </svg>
          {/* h */}
          <svg className="letter-svg" viewBox="0 0 64 64" height="64" width="64" fill="none">
            <path className="dash" stroke="url(#ld-d)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength="360"
              d="M 12,8 L 12,56 M 12,28 C 12,28 20,16 34,16 C 44,16 50,22 50,32 L 50,56" />
          </svg>
          {/* a */}
          <svg className="letter-svg" viewBox="0 0 64 64" height="64" width="64" fill="none">
            <path className="dash" stroke="url(#ld-c)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength="360"
              d="M 48,16 C 48,16 48,56 48,56 M 16,32 C 16,22 22,14 32,14 C 42,14 48,22 48,32 C 48,42 42,50 32,50 C 22,50 16,42 16,32 Z" />
          </svg>
        </div>

        {/* Progress bar */}
        <div className="loader-progress-wrap">
          <div className="loader-progress-bar" ref={barRef} />
        </div>
        <div className="loader-percent" ref={percentRef}>0%</div>
      </div>
    </div>
  );
}
