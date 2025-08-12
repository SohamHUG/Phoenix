"use client";
import { useProgress } from "@react-three/drei";
import { useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function CustomLoader({ onLoaded }: { onLoaded: () => void }) {
    const { progress } = useProgress();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (progress >= 100) {
            const timer = setTimeout(() => {
                gsap.to(".loader-wrapper", {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        setVisible(false);
                        onLoaded();
                    },
                });
            }, 1500); 

            return () => clearTimeout(timer);
        }
    }, [progress, onLoaded]);

    if (!visible) return null;

    return (
        <div className="loader-wrapper fixed inset-0 flex flex-col items-center justify-center">
            <Image
                src="/logo.svg"
                alt="Logo"
                width={164}
                height={64}
                className="mb-6"
                priority
            />
            <div className="w-48 h-2 bg-white rounded overflow-hidden">
                <div
                    className="h-full transition-all duration-300"
                    style={{
                        width: `${progress}%`,
                        backgroundColor: "#FF5304",
                    }}
                />
            </div>

            <p className="font-geist font-semibold text-white text-6xl absolute left-8 bottom-10">LOADING</p>
        </div>
    );
}
