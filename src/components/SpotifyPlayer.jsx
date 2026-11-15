import React, { useState, useEffect, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { PLAYLIST } from "../data/playlist";
import "./SpotifyPlayer.css";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export function SpotifyPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Scale state (Hold and drag corner to resize)
  const [scale, setScale] = useState(1);
  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startScaleRef = useRef(1);

  const audioRef = useRef(null);
  const dragControls = useDragControls();
  const currentTrack = PLAYLIST[currentIdx];

  // Try initial autoplay or wait for first user gesture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
          cleanupGestureListeners();
        })
        .catch(() => {});
    };

    const handleFirstGesture = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
        cleanupGestureListeners();
      }
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
    };

    tryPlay();

    window.addEventListener("pointerdown", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });
    window.addEventListener("scroll", handleFirstGesture, { once: true });

    return () => {
      cleanupGestureListeners();
    };
  }, []);

  // Update track when currentIdx changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.audioSrc;
    audio.load();

    if (hasInteracted || isPlaying) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
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
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback error:", err));
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  // Resize handler (hold on corner grip)
  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    startYRef.current = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    startScaleRef.current = scale;

    const onPointerMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY) || 0;
      // Moving up increases size, down decreases
      const deltaY = startYRef.current - clientY;
      const newScale = Math.min(1.5, Math.max(0.75, startScaleRef.current + deltaY * 0.005));
      setScale(newScale);
    };

    const onPointerUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragControls={dragControls}
      dragListener={false}
      style={{
        scale: isMinimized ? 1 : scale,
        transformOrigin: "bottom left",
      }}
      className={`spotify-floating-container ${isMinimized ? "minimized" : ""}`}
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
      />

      {isMinimized ? (
        /* Minimized Floating Pill */
        <div
          className="spotify-pill-btn"
          onPointerDown={(e) => dragControls.start(e)}
          title="Drag untuk memindahkan, klik untuk memperbesar"
        >
          <div
            className="spotify-pill-cover"
            onClick={() => setIsMinimized(false)}
          >
            <img src={currentTrack.coverSrc} alt={currentTrack.title} />
            {isPlaying && (
              <div className="spotify-pill-wave">
                <span className="bar b1" />
                <span className="bar b2" />
                <span className="bar b3" />
              </div>
            )}
          </div>

          <div
            className="spotify-pill-info"
            onClick={() => setIsMinimized(false)}
          >
            <span className="pill-title">{currentTrack.title}</span>
            <span className="pill-artist">{currentTrack.artist}</span>
          </div>

          <div
            className="spotify-pill-play"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
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
        /* Full Spotify Card */
        <div className="spotify-card">
          {/* Header Drag Handle */}
          <div
            className="spotify-card-top"
            onPointerDown={(e) => dragControls.start(e)}
            title="Tahan & Drag untuk memindahkan player"
          >
            <div className="spotify-brand-badge">
              <span className="drag-handle-dots" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
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
                title="Minimize ke mode kapsul"
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

          {/* Progress Scrubber */}
          <div className="spotify-progress-wrap">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="spotify-seek-bar"
              style={{
                background: `linear-gradient(to right, #BAFF4F ${progressPercent}%, rgba(255, 255, 255, 0.15) ${progressPercent}%)`,
              }}
              aria-label="Seek track"
            />
            <div className="spotify-time-labels">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="spotify-controls">
            <button
              type="button"
              className="ctrl-btn prev"
              onClick={handlePrev}
              title="Lagu Sebelumnya"
              aria-label="Previous track"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              type="button"
              className="ctrl-btn play-pause"
              onClick={togglePlay}
              title={isPlaying ? "Jeda" : "Putar"}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                {isPlaying ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>

            <button
              type="button"
              className="ctrl-btn next"
              onClick={handleNext}
              title="Lagu Berikutnya"
              aria-label="Next track"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Corner Resize / Scale Handle (Hold mouse to scale up/down) */}
          <div
            className="spotify-resize-handle"
            onPointerDown={handleResizeStart}
            title="Tahan & geser mouse ke atas/bawah untuk scale up/down"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M9 1v8H1" stroke="rgba(186,255,79,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M9 5v4H5" stroke="rgba(186,255,79,0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}
