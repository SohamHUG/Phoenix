"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import CustomLoader from "@/components/ui/CustomLoader";
import Navbar from "@/components/ui/NavBar";
import Hero from "@/components/Sections/Hero";
import About from "@/components/Sections/About";
import Merch from "@/components/Sections/Merch";
import NewsLetter from "@/components/Sections/NewsLetter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sections = ["home", "about", "merch", "newsletter"];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const scrollToSection = (index: number) => {
    if (!lenisRef.current) return;
    const scrollTarget = index * window.innerHeight;
    lenisRef.current.scrollTo(scrollTarget, { duration: 1, easing: (t) => t });
  };

  useEffect(() => {
    if (!loaded) return;

    gsap.set(navRef.current, { y: -100, opacity: 0 });
    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 3.1,
    });

    const lenis = new Lenis({ duration: 0.5, smoothWheel: true, easing: (t) => t });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    const panels = gsap.utils.toArray<HTMLElement>(".panel");
    gsap.set(stackRef.current, { position: "relative", overflow: "hidden" });
    gsap.set(panels, { position: "absolute", inset: 0, yPercent: 100 });
    if (panels[0]) gsap.set(panels[0], { yPercent: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stackRef.current!,
        start: "top top",
        end: () => "+=" + (panels.length - 1) * window.innerHeight,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIndex = Math.min(
            panels.length - 1,
            Math.floor(progress * panels.length)
          );
          setActiveSection(activeIndex);
        },
      },
      defaults: { ease: "power2.out", duration: 0.8 },
    });

    tlRef.current = tl;

    panels.slice(1).forEach((panel) => {
      tl.to(panel, { yPercent: 0 }, ">");
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loaded]);

  return (
    <main className="w-full min-h-screen relative">
      {!loaded && (
        <div
          ref={loaderRef}
          className={`absolute inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          style={{
            backgroundImage: "linear-gradient(252.44deg, #040301 39.56%, #FF5304 100%), url('/img/noise_texture.png')",
            backgroundBlendMode: "overlay",
          }}
        >
          <CustomLoader onLoaded={() => setLoaded(true)} />
        </div>
      )}

      {loaded && (
        <div ref={stackRef} className="min-h-screen">
          <div ref={navRef} className="opacity-0 fixed top-0 left-0 w-full z-50">
            <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
          </div>

          <section
            id="home"
            className="panel min-h-screen flex items-center justify-center text-white"
            style={{
              backgroundImage: "linear-gradient(252.44deg, #040301 39.56%, #FF5304 100%), url('/img/noise_texture.png')",
              backgroundBlendMode: "overlay",
            }}
          >
            <Hero scrollToMerch={() => scrollToSection(2)} active={activeSection === 0} />
          </section>

          <section id="about" className="panel min-h-screen w-full bg-[#DEDFDF] border-t border-[#ccc]">
            <About active={activeSection === 1} />
          </section>

          <section id="merch" className="panel min-h-screen w-full bg-[#DEDFDF] border-t border-[#ccc]">
            <Merch active={activeSection === 2} />
          </section>

          <section id="newsletter" className="panel min-h-screen w-full">
            <NewsLetter active={activeSection === 3} />
          </section>
        </div>
      )}
    </main>
  );
}
