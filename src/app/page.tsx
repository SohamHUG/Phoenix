"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatedText } from "@/components/ui/text-animation";
import ReactHowler from "react-howler";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollDrivenBoxes } from "@/components/three/ScrollDrivenBoxes";
import { Environment, EnvironmentMap } from "@react-three/drei";
import Phx from "@/components/three/Phx";
import PhxParticles from "@/components/three/PhxParticles";
import CustomLoader from "@/components/ui/CustomLoader";
import Navbar from "@/components/ui/NavBar";
import Lenis from "lenis";
import Hero from "@/components/Sections/Hero";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!loaded || !navRef.current) return;

    gsap.set(navRef.current, { y: -100, opacity: 0 });

    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 1.3,
    });
  }, [loaded]);

  return (
    <main className="w-full h-screen mx-auto">
      <div className="w-full max-w-screen h-screen bg-[linear-gradient(252.44deg,#040301_39.56%,#FF5304_100%)]">
        {!loaded && <CustomLoader onLoaded={() => setLoaded(true)} />}

        {loaded && (
          <>
            <div ref={navRef} className="opacity-0 fixed top-0 left-0 w-full z-50">
              <Navbar />
            </div>
            <section id="home" className="h-screen inset-0 flex flex-col items-center justify-center text-center text-white">
              <Hero />
            </section>
          </>
        )}
      </div>

      {loaded && (
        <>
          <section id="about" className="section flex items-center justify-center h-screen bg-white">
            <h1>ABOUT</h1>
          </section>

          <section id="merch" className="section flex items-center justify-center h-screen bg-white">
            <h1>MERCH</h1>
          </section>

          <section id="newsletter" className="section flex items-center justify-center h-screen bg-white">
            <h1>NEWSLETTER</h1>
          </section>
        </>
      )}


    </main>
  );
}