import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NotFound } from "./components/NotFound";
import { LoadingScreen } from "./components/LoadingScreen";

function Root() {
  const [loaded, setLoaded] = useState(false);
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname.replace(/\/+$/, "") || "/"
  );

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      setCurrentPath(path);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const isHome = currentPath === "" || currentPath === "/";

  // Show loading only on home route
  if (!loaded && isHome) {
    return <LoadingScreen onDone={() => setLoaded(true)} />;
  }

  if (!isHome) {
    return (
      <NotFound
        onGoHome={() => {
          window.history.pushState({}, "", "/");
          setCurrentPath("/");
        }}
      />
    );
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
