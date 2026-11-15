import React from "react";
import "./NotFound.css";

export function NotFound({ onGoHome }) {
  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onGoHome) {
      onGoHome();
    } else {
      window.history.pushState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <main className="not-found-wrapper" role="main">
      <div className="not-found-inner">
        <span className="not-found-code">404</span>

        <h1 className="not-found-title">Page not found</h1>

        <p className="not-found-desc">
          The page you are looking for doesn't exist, has been removed, or the link is incorrect.
        </p>

        <div className="not-found-actions">
          <a href="/" onClick={handleHomeClick} className="not-found-primary-btn">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
