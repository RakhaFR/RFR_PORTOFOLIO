import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function HoverImageLinks({ projects }) {
  const [activeProject, setActiveProject] = useState(null);
  const containerRef = useRef(null);

  // Mouse tracking with smooth spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Dynamic tilt angle based on horizontal mouse movement
  const [tilt, setTilt] = useState(0);
  const lastXRef = useRef(0);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Calculate velocity / direction for dynamic lean tilt
    const deltaX = currentX - lastXRef.current;
    lastXRef.current = currentX;

    const clampedTilt = Math.max(-14, Math.min(14, deltaX * 0.45));
    setTilt(clampedTilt);

    mouseX.set(currentX);
    mouseY.set(currentY);
  };

  const handleMouseLeave = () => {
    setActiveProject(null);
    setTilt(0);
  };

  return (
    <div
      ref={containerRef}
      className="hover-image-links-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating Pointer-Follow Image (Aceternity Spring Trail) */}
      <motion.div
        className="floating-hover-image-box"
        style={{
          x: smoothX,
          y: smoothY,
          rotate: tilt,
          pointerEvents: "none",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: activeProject ? 1 : 0,
          scale: activeProject ? 1 : 0.85,
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="floating-image-inner"
            >
              <img
                src={activeProject.img}
                alt={activeProject.title}
                loading="eager"
              />
              <div className="floating-image-caption">
                <span className="caption-tag">{activeProject.tag}</span>
                <span className="caption-hint">Visit Site ↗</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Vertical Project Links List */}
      <div className="hover-links-list">
        {projects.map((project, idx) => {
          const isHovered = activeProject?.title === project.title;
          const isAnyHovered = activeProject !== null;
          const isDimmed = isAnyHovered && !isHovered;

          return (
            <a
              key={idx}
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className={`hover-link-item ${isHovered ? "active" : ""} ${isDimmed ? "dimmed" : ""}`}
              onMouseEnter={() => setActiveProject(project)}
            >
              <div className="link-item-left">
                <span className="link-index">{String(idx + 1).padStart(2, "0")}</span>
                <div className="link-title-group">
                  <h3 className="link-heading">{project.title}</h3>
                  <p className="link-desc">{project.desc}</p>
                </div>
              </div>

              <div className="link-item-right">
                <span className="link-tag-pill">{project.tag}</span>
                <div className="link-arrow-circle" aria-hidden="true">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>

              {/* Mobile Inline Thumbnail (Fallback for Touch/Small screens) */}
              <div className="mobile-thumb-preview">
                <img src={project.img} alt={project.title} loading="lazy" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
