"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import Image from "next/image";
import ListenNowButton from "./ListenNowBtn";

const sections = ["home", "about", "merch", "newsletter"];

export default function Navbar({ activeSection, scrollToSection }: { activeSection: number; scrollToSection: (index: number) => void }) {
    const [isHomeSection, setIsHomeSection] = useState(activeSection === 0);
    const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
    const logoWhiteRef = useRef<HTMLImageElement>(null);
    const logoDarkRef = useRef<HTMLImageElement>(null);


    useEffect(() => {
        const newIsHome = activeSection === 0;

        if (newIsHome !== isHomeSection) {
            setIsHomeSection(newIsHome);
            animateLogoTransition(newIsHome);
        }

        progressRefs.current.forEach((bar, index) => {
            if (!bar) return;
            const targetWidth = index <= activeSection ? "100%" : "0%";
            gsap.to(bar, {
                width: targetWidth,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    }, [activeSection]);

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

    return (
        <nav className="fixed top-0 left-0 w-full max-w-[2650px] mx-auto flex items-center justify-between px-10 py-4 z-50">
            <div className="relative w-[188px] h-[69px]">
                <Image
                    ref={logoWhiteRef}
                    src="/logo.svg"
                    alt="Logo"
                    width={188}
                    height={69}
                    className="absolute cursor-pointer"
                    style={{ opacity: isHomeSection ? 1 : 0 }}
                    onClick={() => scrollToSection(0)}
                />
                <Image
                    ref={logoDarkRef}
                    src="/logo-dark.svg"
                    alt="Logo"
                    width={188}
                    height={69}
                    className="absolute cursor-pointer"
                    style={{ opacity: isHomeSection ? 0 : 1 }}
                    onClick={() => scrollToSection(0)}
                />
            </div>

            <div className="flex bg-white rounded-[4px] h-[60px]">
                {sections.map((sec, i) => (
                    <div
                        key={sec}
                        onClick={() => scrollToSection(i)}
                        className={`
                            font-inter relative px-5 flex items-center text-center hover:bg-[#DEDFDF] hover:cursor-pointer 
                            ${i === 0 ? "rounded-l-[4px]" : ""} 
                            ${i === sections.length - 1 ? "rounded-r-[4px]" : ""}
                        `}
                    >
                        <div
                            ref={(el) => { progressRefs.current[i] = el; }}
                            className={`absolute inset-0 bg-[#FF5304] z-0 rounded-[inherit] `}
                            style={{ width: "0%" }}
                        />
                        <span className={`relative z-10 ${i <= activeSection ? "text-white" : "text-black"}`}>
                            {sec.charAt(0).toUpperCase() + sec.slice(1)}
                        </span>
                    </div>
                ))}
            </div>

            <ListenNowButton isHomeSection={isHomeSection} />
        </nav>
    );
}
