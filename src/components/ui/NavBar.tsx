"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ListenNowButton from "./ListenNowBtn";

gsap.registerPlugin(ScrollTrigger);

const sections = ["home", "about", "merch", "newsletter"];

export default function Navbar() {
    const [isHomeSection, setIsHomeSection] = useState(true);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeSection, setActiveSection] = useState(0);
    const logoContainerRef = useRef<HTMLDivElement>(null);
    const logoWhiteRef = useRef<HTMLImageElement>(null);
    const logoDarkRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        progressRefs.current = progressRefs.current.slice(0, sections.length);
        gsap.set(progressRefs.current[0], { width: '100%' });

        sections.forEach((id, index) => {
            ScrollTrigger.create({
                trigger: `#${id}`,
                start: "top center",
                end: "bottom center",
                onToggle: ({ isActive }) => {
                    if (isActive) {
                        setActiveSection(index);
                        updateProgressBars(index);
                        const newIsHome = id === "home";
                        if (newIsHome !== isHomeSection) {
                            setIsHomeSection(newIsHome);
                            animateLogoTransition(newIsHome);
                        }
                    }
                }
            });
        });

        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, [isHomeSection]);

    const animateLogoTransition = (showWhiteLogo: boolean) => {
        gsap.to(logoWhiteRef.current, {
            opacity: showWhiteLogo ? 1 : 0,
            duration: 0.4,
            ease: "power2.inOut"
        });
        gsap.to(logoDarkRef.current, {
            opacity: showWhiteLogo ? 0 : 1,
            duration: 0.4,
            ease: "power2.inOut"
        });
    };

    const updateProgressBars = (activeIndex: number) => {
        progressRefs.current.forEach((bar, index) => {
            if (!bar) return;
            const width = index <= activeIndex ? '100%' : '0%';
            gsap.to(bar, { width, duration: 0.5, ease: "power2.out" });
        });
    };

    return (
        <nav className="fixed top-0 left-0 w-full max-w-[2650px] mx-auto flex items-center justify-between px-10 py-4 z-50">
            <div ref={logoContainerRef} className="relative w-[188px] h-[69px]">
                <Image
                    ref={logoWhiteRef}
                    src="/logo.svg"
                    alt="Logo"
                    width={188}
                    height={69}
                    className="absolute transition-opacity duration-300"
                    style={{ opacity: isHomeSection ? 1 : 0 }}
                />

                <Image
                    ref={logoDarkRef}
                    src="/logo-dark.svg"
                    alt="Logo"
                    width={188}
                    height={69}
                    className="absolute transition-opacity duration-300"
                    style={{ opacity: isHomeSection ? 0 : 1 }}
                />
            </div>

            <div className="flex bg-white rounded-[4px] h-[60px]">
                {sections.map((sec, i) => (
                    <Link
                        key={sec}
                        href={`#${sec}`}
                        className={`font-inter relative px-5 flex items-center text-center hover:bg-[#DEDFDF] ${i === 0 ? "rounded-l-[4px]" : ""} ${i === sections.length - 1 ? "rounded-r-[4px]" : ""}`}
                        onClick={() => {
                            setActiveSection(i);
                            const newIsHome = sec === "home";
                            if (newIsHome !== isHomeSection) {
                                setIsHomeSection(newIsHome);
                                animateLogoTransition(newIsHome);
                            }
                        }}
                    >
                        <div
                            ref={(el) => { (progressRefs.current as (HTMLDivElement | null)[])[i] = el }}
                            className="absolute inset-0 bg-[#FF5304] z-0 rounded-[inherit]"
                            style={{ width: i <= activeSection ? '100%' : '0%' }}
                        />
                        <span className={`relative z-10 ${i <= activeSection ? "text-white" : "text-black"}`}>
                            {sec.charAt(0).toUpperCase() + sec.slice(1)}
                        </span>
                    </Link>
                ))}
            </div>

            {/* <button
                ref={buttonRef}
                className="px-4 py-2 h-[60px] font-geist uppercase rounded font-extrabold text-[16px] transition-colors duration-300"
                style={{
                    backgroundColor: isHomeSection ? "#DEDFDF" : "#2F2F2F",
                    color: isHomeSection ? "#2F2F2F" : "#DEDFDF",
                }}
            >
                Listen Now
            </button> */}

            <ListenNowButton isHomeSection={isHomeSection} />
        </nav>
    );
}