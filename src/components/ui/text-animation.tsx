"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimatedTextProps = {
  text: string;
  className?: string;
};

export const AnimatedText = ({ text, className = "text-6xl sm:text-8xl font-bold leading-tight font-waffold" }: AnimatedTextProps) => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const chars = textRef.current.querySelectorAll('.char');
    
    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <h1 ref={textRef} className={className}>
      {text.split('').map((char, index) => (
        <span key={index} className="char inline-block">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
};
