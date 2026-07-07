import { useState } from "react";
import Loader        from "./components/Loader";
import Header        from "./components/Header";
import Footer        from "./components/Footer";
import ParallaxOrbs  from "./components/ParallaxOrbs";
import Hero          from "./components/sections/Hero";
import About         from "./components/sections/About";
import Gallery       from "./components/sections/Gallery";
import Skills        from "./components/sections/Skills";
import Certificate   from "./components/sections/Certificate";
import Portfolio     from "./components/sections/Portfolio";
import ChatRoom      from "./components/sections/ChatRoom";
import Contact       from "./components/sections/Contact";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Page Loader — shown first, hides on complete */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* Main site — rendered but invisible until loader done */}
      <div style={{ visibility: loaded ? "visible" : "hidden" }}>
        <Header />

        <main>
          <Hero />
          <About />
          <Gallery />
          <Skills />
          <Certificate />
          <Portfolio />
          <ChatRoom />
          <Contact />
        </main>

        <Footer />

        {/* Parallax orbs injected into sections */}
        <ParallaxOrbs />
      </div>
    </>
  );
}
