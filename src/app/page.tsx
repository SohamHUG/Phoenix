"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatedText } from "@/components/ui/text-animation";
import ReactHowler from "react-howler";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollDrivenBoxes } from "@/components/three/ScrollDrivenBoxes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".section", 
        { 
          opacity: 0,
          scale: 0.98
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".section",
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden bg-background text-foreground">
      <ReactHowler src="/aha.mp3" playing={playing} onEnd={() => setPlaying(false)} />
      
      <div className="fixed top-0 left-0 w-full h-full">
        <Canvas ref={canvasRef} className="w-full h-full">
          <ambientLight intensity={0.4} color="#4a5568" />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffd700" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff6b6b" />
          <pointLight position={[0, 10, -10]} intensity={0.6} color="#4ecdc4" />
          <ScrollDrivenBoxes playing={playing} setPlaying={setPlaying} />
        </Canvas>
      </div>

      <div className="relative z-10">
        <section className="section h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider font-playfair">
              TAMATAR
            </h1>
            <p className="text-lg md:text-xl font-light text-muted-foreground font-plex">
              Scroll to experience
            </p>
          </div>
        </section>

        <section className="section min-h-screen flex items-center justify-center px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatedText 
              text="Every scroll tells a story. Every interaction creates a moment. This is where technology meets artistry in perfect harmony."
              className="text-2xl md:text-4xl font-light leading-relaxed font-playfair text-center"
            />
          </div>
        </section>

        <section className="section min-h-screen flex items-center justify-center px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "MOTION", desc: "Fluid animations that respond to your touch" },
              { title: "DESIGN", desc: "Minimalist aesthetics with maximum impact" },
              { title: "EXPERIENCE", desc: "Immersive interactions beyond imagination" }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="border border-border p-8 h-64 flex flex-col justify-between transition-all duration-500 hover:border-muted-foreground hover:bg-muted/20 backdrop-blur-sm">
                  <h3 className="text-sm font-plex tracking-widest text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </h3>
                  <div>
                    <h2 className="text-2xl font-light mb-4 font-playfair">
                      {item.title}
                    </h2>
                    <p className="text-muted-foreground font-plex text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-light font-playfair">
              Thank you
            </h2>
            <p className="text-muted-foreground font-plex">for experiencing this journey</p>
          </div>
        </section>
      </div>
    </div>
  );
}