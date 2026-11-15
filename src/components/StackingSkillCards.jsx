import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function StackingSkillCards({ stages }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="stacking-skills-wrapper">
      {stages.map((stage, i) => {
        const targetScale = 1 - (stages.length - i) * 0.04;
        const startRange = i * (1 / stages.length);
        return (
          <StackCard
            key={stage.step}
            i={i}
            stage={stage}
            progress={scrollYProgress}
            range={[startRange, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}

function StackCard({ i, stage, progress, range, targetScale }) {
  const cardContainerRef = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={cardContainerRef} className="stack-card-pin-container">
      <motion.div
        style={{
          scale,
          top: `calc(90px + ${i * 22}px)`,
        }}
        className="stack-card-body"
      >
        <div className="journey-card-top-bar">
          <span className="journey-phase-badge">{stage.phase}</span>
          <span className="journey-card-step-num">STEP {stage.step}</span>
        </div>

        <div className="journey-card-meta">
          <h3 className="journey-card-title">{stage.title}</h3>
          <p className="journey-card-summary">{stage.summary}</p>
        </div>

        <div className="journey-skills-tile-grid">
          {stage.skills.map((skill) => (
            <div key={skill.id} className="journey-skill-tile">
              <div className="tile-header">
                <div className="tile-icon-box">
                  <img src={skill.icon} alt={skill.name} />
                </div>
                <span className="tile-status-tag">{skill.level}</span>
              </div>

              <h4 className="tile-title">{skill.name}</h4>
              <p className="tile-desc">{skill.desc}</p>

              <div className="tile-meter-wrap">
                <div className="tile-meter-labels">
                  <span className="tile-progress-lbl">Mastery Level</span>
                  <span className="tile-percent-val">{skill.percent}</span>
                </div>
                <div className="tile-bar-track">
                  <div
                    className="tile-bar-fill"
                    style={{ width: skill.percent }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
