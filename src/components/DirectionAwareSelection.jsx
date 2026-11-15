import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DirectionAwareSelection() {
  const containerRef = useRef(null);
  const [selectedBox, setSelectedBox] = useState(null);
  const [direction, setDirection] = useState("left");

  const getEntryDirection = (e, target) => {
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x) * (180 / Math.PI);

    if (angle >= -45 && angle < 45) return "right";
    if (angle >= 45 && angle < 135) return "bottom";
    if (angle >= -135 && angle < -45) return "top";
    return "left";
  };

  const handleMouseEnter = (e, tag) => {
    const target = e.currentTarget;
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const dir = getEntryDirection(e, target);
    setDirection(dir);

    setSelectedBox({
      top: targetRect.top - containerRect.top - 3,
      left: targetRect.left - containerRect.left - 6,
      width: targetRect.width + 12,
      height: targetRect.height + 6,
      tag,
    });
  };

  const handleContainerMouseLeave = () => {
    setSelectedBox(null);
  };

  return (
    <div
      ref={containerRef}
      className="direction-selection-container"
      onMouseLeave={handleContainerMouseLeave}
      style={{
        position: "relative",
        display: "inline-block",
        width: "100%",
      }}
    >
      {/* Design Tool Layer Selection Box */}
      <AnimatePresence>
        {selectedBox && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              top: selectedBox.top,
              left: selectedBox.left,
              width: selectedBox.width,
              height: selectedBox.height,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              transition: { duration: 0.2 },
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="selection-bounding-frame"
            style={{
              position: "absolute",
              pointerEvents: "none",
              border: "1.5px solid #BAFF4F",
              borderRadius: "4px",
              boxShadow: "0 0 15px rgba(186, 255, 79, 0.35)",
              zIndex: 10,
            }}
          >
            {/* 4 Corner Resize Handles (Figma style) */}
            <span className="resize-handle top-left" />
            <span className="resize-handle top-right" />
            <span className="resize-handle bottom-left" />
            <span className="resize-handle bottom-right" />

            {/* Live Size & Layer Meta Tag */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="selection-meta-tag"
            >
              <span>
                {Math.round(selectedBox.width)} × {Math.round(selectedBox.height)}
              </span>
              <span className="meta-tag-pill">{selectedBox.tag}</span>
            </motion.div>

            {/* Direction Aware Fill Gradient */}
            <motion.div
              key={direction + selectedBox.tag}
              initial={{
                opacity: 0,
                x: direction === "left" ? -20 : direction === "right" ? 20 : 0,
                y: direction === "top" ? -20 : direction === "bottom" ? 20 : 0,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at center, rgba(186, 255, 79, 0.18) 0%, rgba(186, 255, 79, 0.04) 100%)",
                borderRadius: "3px",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paragraph Content with Interactive Tokens */}
      <p className="about-interactive-copy">
        My name is{" "}
        <span
          className="selection-token"
          onMouseEnter={(e) => handleMouseEnter(e, "IDENTITY")}
        >
          Rakha Fadilah Riyadi
        </span>
        . I'm a{" "}
        <span
          className="selection-token"
          onMouseEnter={(e) => handleMouseEnter(e, "DEV · UI/UX")}
        >
          front-end web developer
        </span>{" "}
        from{" "}
        <span
          className="selection-token"
          onMouseEnter={(e) => handleMouseEnter(e, "LOCATION")}
        >
          Bogor, West Java
        </span>
        , with{" "}
        <span
          className="selection-token"
          onMouseEnter={(e) => handleMouseEnter(e, "3+ YRS")}
        >
          three years of hands-on experience
        </span>
        . In my opinion, building software is not just a job — it's an{" "}
        <span
          className="selection-token"
          onMouseEnter={(e) => handleMouseEnter(e, "ART FORM")}
        >
          art form with aesthetic value
        </span>
        . My goal is to craft websites that are{" "}
        <span
          className="selection-token"
          onMouseEnter={(e) => handleMouseEnter(e, "OBJECTIVE")}
        >
          functional, user-friendly, and visually memorable
        </span>
        .
      </p>
    </div>
  );
}
