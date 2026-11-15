import React, { useState, useEffect, useRef } from "react";
import { motion, useDragControls, useMotionValue, animate } from "framer-motion";
import { PLAYLIST } from "../data/playlist";
import "./SpotifyPlayer.css";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// Snap threshold: distance from viewport corner to trigger magnetic snap
const SNAP_THRESHOLD = 150;
// Padding from viewport edge when snapped
const SNAP_PADDING = 24;

export function SpotifyPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Scale state (hold corner grip to resize)
  const [scale, setScale] = useState(1);
  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startScaleRef = useRef(1);

  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const dragControls = useDragControls();

  // Framer Motion position values — start at bottom-left corner (pill mode)
  const x = useMotionValue(SNAP_PADDING);
  const y = useMotionValue(-(SNAP_PADDING));

  const currentTrack = PLAYLIST[currentIdx];

  // Start minimized at bottom-left corner
  useEffect(() => {
    setIsMinimized(true);
  }, []);

  // Try autoplay or wait for first user gesture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;

    const tryPlay = () => {
      audio.play()
        .then(() => { setIsPlaying(true); setHasInteracted(true); removeListeners(); })
        .catch(() => {});
    };

    const handleFirstGesture = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
        removeListeners();
      }
    };

    const removeListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
    };

    tryPlay();
    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("scroll", handleFirstGesture, { once: true });

    return removeListeners;
  }, []);

  // Update track on change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.audioSrc;
    audio.load();
    if (hasInteracted || isPlaying) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentIdx]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleNext = () => setCurrentIdx((p) => (p + 1) % PLAYLIST.length);
  const handlePrev = () => setCurrentIdx((p) => (p - 1 + PLAYLIST.length) % PLAYLIST.length);
  const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
  const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };
  const handleSeek = (e) => {
    const t = parseFloat(e.target.value);
    if (audioRef.current) { audioRef.current.currentTime = t; setCurrentTime(t); }
  };

  // Resize grip handler
  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    startYRef.current = e.clientY;
    startScaleRef.current = scale;

    const onMove = (ev) => {
      if (!isResizingRef.current) return;
      const delta = startYRef.current - ev.clientY;
      setScale(Math.min(1.5, Math.max(0.75, startScaleRef.current + delta * 0.005)));
    };
    const onUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // Magnetic snap logic on drag end
  const handleDragEnd = () => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Center of the dragged element
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Distance from each corner
    const corners = [
      { name: "tl", dx: cx, dy: cy },                           // top-left
      { name: "tr", dx: vw - cx, dy: cy },                      // top-right
      { name: "bl", dx: cx, dy: vh - cy },                      // bottom-left
      { name: "br", dx: vw - cx, dy: vh - cy },                 // bottom-right
    ];
    const nearest = corners.reduce((a, b) =>
      Math.hypot(a.dx, a.dy) < Math.hypot(b.dx, b.dy) ? a : b
    );
    const dist = Math.hypot(nearest.dx, nearest.dy);

    if (dist < SNAP_THRESHOLD) {
      // Snap to nearest corner and minimize
      let snapX, snapY;
      const p = SNAP_PADDING;

      if (nearest.name === "tl") { snapX = p; snapY = p; }
      else if (nearest.name === "tr") { snapX = vw - rect.width - p; snapY = p; }
      else if (nearest.name === "bl") { snapX = p; snapY = vh - rect.height - p; }
      else { snapX = vw - rect.width - p; snapY = vh - rect.height - p; }

      // Convert to motion values (which are relative to initial fixed pos 0,0)
      // The element starts at fixed bottom-left; x/y are offsets from that origin
      // We need absolute page position: set x/y so element ends at snapX/snapY
      const originLeft = 0;
      const originTop = 0;
      // current computed offset from origin:
      // rect.left = originLeft + x.get(), rect.top = originTop + y.get()
      const targetX = snapX;
      const targetY = snapY;

      animate(x, targetX, { type: "spring", stiffness: 400, damping: 32 });
      animate(y, targetY, { type: "spring", stiffness: 400, damping: 32 });
      setIsMinimized(true);
    } else {
      // Center area → expand to full card
      setIsMinimized(false);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      ref={containerRef}
      drag
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      style={{
        x,
        y,
        scale: isMinimized ? 1 : scale,
        transformOrigin: "top left",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        touchAction: "none",
      }}
      onDragEnd={handleDragEnd}
      className={`spotify-floating-container ${isMinimized ? "minimized" : ""}`}
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {isMinimized ? (
        /* Minimized Pill */
        <div
          className="spotify-pill-btn"
          onPointerDown={(e) => dragControls.start(e)}
          title="Drag ke tengah untuk perluas, klik untuk expand"
        >
          <div className="spotify-pill-cover" onClick={() => setIsMinimized(false)}>
            <img src={currentTrack.coverSrc} alt={currentTrack.title} />
            {isPlaying && (
              <div className="spotify-pill-wave">
                <span className="bar b1" />
                <span className="bar b2" />
                <span className="bar b3" />
              </div>
            )}
          </div>

          <div className="spotify-pill-info" onClick={() => setIsMinimized(false)}>
            <span className="pill-title">{currentTrack.title}</span>
            <span className="pill-artist">{currentTrack.artist}</span>
          </div>

          <div
            className="spotify-pill-play"
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            title={isPlaying ? "Jeda" : "Putar"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              {isPlaying ? (
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </div>
        </div>
      ) : (
        /* Full Card */
        <div className="spotify-card">
          {/* Header / Drag Handle */}
          <div
            className="spotify-card-top"
            onPointerDown={(e) => dragControls.start(e)}
            title="Tahan & drag ke pojok untuk minimize, tengah layar untuk full"
          >
            <div className="spotify-brand-badge">
              <span className="drag-handle-dots" aria-hidden="true">
                <span /><span /><span /><span /><span /><span />
              </span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#BAFF4F">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.307c-.216.353-.675.467-1.028.251-2.825-1.727-6.381-2.118-10.569-1.162-.404.093-.808-.16-.9-.564-.093-.404.16-.808.564-.9 4.582-1.047 8.514-.606 11.682 1.347.353.216.467.675.251 1.028zm1.468-3.264c-.272.443-.852.584-1.295.312-3.232-1.986-8.159-2.56-11.982-1.399-.499.151-1.031-.131-1.182-.63-.151-.499.131-1.031.63-1.182 4.372-1.327 9.799-.684 13.517 1.604.443.272.584.852.312 1.295zm.126-3.411C15.225 8.358 8.853 8.148 5.158 9.27c-.604.183-1.246-.164-1.429-.768-.183-.604.164-1.246.768-1.429 4.246-1.289 11.282-1.043 15.753 1.611.543.322.723 1.025.401 1.568-.322.543-1.025.723-1.568.401z" />
              </svg>
              <span>Spotify Player</span>
            </div>

            <div className="spotify-header-actions">
              <button
                type="button"
                className="spotify-minimize-btn"
                onClick={() => setIsMinimized(true)}
                title="Minimize"
                aria-label="Minimize"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="spotify-main-content">
            <div className="spotify-cover-wrap">
              <img src={currentTrack.coverSrc} alt={currentTrack.title} />
              {isPlaying && (
                <div className="spotify-cover-overlay">
                  <div className="spotify-equalizer">
                    <span className="eq eq1" />
                    <span className="eq eq2" />
                    <span className="eq eq3" />
                    <span className="eq eq4" />
                  </div>
                </div>
              )}
            </div>

            <div className="spotify-track-meta">
              <h4 className="spotify-track-title">{currentTrack.title}</h4>
              <p className="spotify-track-artist">{currentTrack.artist}</p>
              <span className="spotify-track-count">
                {currentIdx + 1} of {PLAYLIST.length}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="spotify-progress-wrap">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="spotify-seek-bar"
              style={{
                background: `linear-gradient(to right, #BAFF4F ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
              }}
              aria-label="Seek track"
            />
            <div className="spotify-time-labels">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="spotify-controls">
            <button type="button" className="ctrl-btn prev" onClick={handlePrev} aria-label="Previous">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button type="button" className="ctrl-btn play-pause" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                {isPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>

            <button type="button" className="ctrl-btn next" onClick={handleNext} aria-label="Next">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Corner Resize Grip */}
          <div
            className="spotify-resize-handle"
            onPointerDown={handleResizeStart}
            title="Tahan & geser atas/bawah untuk scale"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M9 1v8H1" stroke="rgba(186,255,79,0.8)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 5v4H5" stroke="rgba(186,255,79,0.8)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}
