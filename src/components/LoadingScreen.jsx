import React, { useEffect, useState, useRef } from "react";
import "./LoadingScreen.css";

// Critical assets to preload before showing app
const CRITICAL_IMAGES = [
  "/img/hero.jpeg",
  "/music/into-you-altare.alt.webp",
  "/music/circus-altare.alt.webp",
  "/music/ariana-grande-bye-altare-remix.webp",
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve; // resolve even on error — don't block
    img.src = src;
  });
}

export function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    let loaded = 0;
    const total = CRITICAL_IMAGES.length;

    const promises = CRITICAL_IMAGES.map((src) =>
      preloadImage(src).then(() => {
        loaded += 1;
        setProgress(Math.round((loaded / total) * 100));
      })
    );

    // Also wait minimum 1.4s so the screen doesn't flash away instantly
    const minWait = new Promise((r) => setTimeout(r, 1400));

    Promise.all([...promises, minWait]).then(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      setProgress(100);
      // Short pause at 100% then fade out
      setTimeout(() => {
        setExiting(true);
        setTimeout(onDone, 600); // matches CSS transition
      }, 300);
    });
  }, []);

  return (
    <div className={`loading-screen ${exiting ? "loading-screen--exit" : ""}`}>
      <div className="loading-inner">
        {/* Logo / Name */}
        <div className="loading-logo">
          <span className="loading-name">RFR</span>
          <span className="loading-dot" />
        </div>

        {/* Progress bar */}
        <div className="loading-bar-wrap">
          <div
            className="loading-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter */}
        <span className="loading-counter">{progress}%</span>

        {/* Status text */}
        <span className="loading-status">
          {progress < 40
            ? "Memuat aset..."
            : progress < 80
            ? "Menyiapkan komponen..."
            : progress < 100
            ? "Hampir siap..."
            : "Selamat datang ✦"}
        </span>
      </div>
    </div>
  );
}
