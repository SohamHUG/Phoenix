"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import Image from "next/image";

export default function ListenNowButton({ isHomeSection }: { isHomeSection: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const mainButtonRef = useRef<HTMLButtonElement>(null);
    const dotsButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        hoverTimeout.current = setTimeout(() => {
            setIsExpanded(true);

            gsap.to(mainButtonRef.current, {
                width: 160,
                duration: 0.2,
                ease: "power2.out",
            });

            gsap.to(dotsButtonRef.current, {
                opacity: 0,
                duration: 0.1,
                onComplete: () => {
                    if (dotsButtonRef.current) dotsButtonRef.current.style.display = "none";
                },
            });

            gsap.fromTo(
                menuRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }, 150);
    };

    const handleMouseLeave = () => {
        // 🔹 empêche ouverture si pas encore déclenché
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }

        // 🔹 kill les anims en cours
        gsap.killTweensOf([mainButtonRef.current, dotsButtonRef.current, menuRef.current]);

        setIsExpanded(false);

        gsap.to(mainButtonRef.current, {
            width: 120,
            duration: 0.2,
            ease: "power2.out",
        });

        if (dotsButtonRef.current) dotsButtonRef.current.style.display = "flex";
        gsap.to(dotsButtonRef.current, {
            opacity: 1,
            duration: 0.2,
        });

        gsap.to(menuRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.1,
        });
    };


    return (
        <div
            className="relative flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ width: 155, height: 60 }}
        >
            <button
                ref={mainButtonRef}
                className={`absolute left-0 top-0 h-[60px] font-geist uppercase rounded font-extrabold text-[16px] transition-all duration-300 flex items-center justify-center z-20 hover:bg-[#FF5304] hover:cursor-pointer ${isHomeSection ? "bg-[#DEDFDF] text-[#2F2F2F]" : "bg-[#2F2F2F] text-[#DEDFDF]"}`}
                style={{ width: 120 }}
            >
                Listen Now
            </button>

            <button
                ref={dotsButtonRef}
                className={`absolute right-0 top-0 h-[60px] w-[30px] rounded flex items-center justify-center z-10 transition-all duration-300 ${isHomeSection ? "bg-[#DEDFDF] text-[#2F2F2F]" : "bg-[#2F2F2F] text-[#DEDFDF]"}`}
            >
                <div className="relative w-3 h-4">
                    <span className="absolute top-0 left-0 w-1 h-1 rounded-full bg-current"></span>
                    <span className="absolute bottom-0 left-0 w-1 h-1 rounded-full bg-current"></span>
                    <span className="absolute top-1/2 right-0 w-1 h-1 rounded-full bg-current transform -translate-y-1/2"></span>
                </div>
            </button>

            <div
                ref={menuRef}
                className={`absolute top-full right-[-4] w-[315px] rounded shadow-lg my-0.5 py-1 z-30 bg-[#FF5304]`}
                style={{ opacity: 0, pointerEvents: isExpanded ? 'auto' : 'none' }}
            >
                <p className="px-4 py-3 h-28 hover:bg-opacity-20 bg-white hover:bg-[#DEDFDF] mx-3 my-3 flex items-center justify-center rounded">
                    <Image src="/img/spotify.png" alt="Spotify" width={110} height={26} />
                </p>
                <p className="px-4 py-3 h-28 hover:bg-opacity-20 bg-white hover:bg-[#DEDFDF] mx-3 my-3 flex items-center justify-center rounded">
                    <Image src="/img/applemusic.png" alt="Apple Music" width={110} height={26} />
                </p>
            </div>
        </div>

    );
}