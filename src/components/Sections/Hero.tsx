"use client"

import { EnvironmentMap } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Phx from "../three/Phx"
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { title } from "process";

export default function Hero() {
    const mainButtonRef = useRef<HTMLButtonElement>(null);
    const dotsButtonRef = useRef<HTMLButtonElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const merchRef = useRef<HTMLParagraphElement>(null);
    const scrollRef = useRef<HTMLParagraphElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {

        gsap.set(titleRef.current, { x: 1000, opacity: 0 });
        gsap.set(imageRef.current, { x: 1000, opacity: 0 });
        gsap.set(merchRef.current, { x: -1000, opacity: 0 });
        gsap.set(scrollRef.current, { y: 100, opacity: 0 });

        gsap.to(titleRef.current, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.5,
        });

        gsap.to(imageRef.current, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.5,
        });

        gsap.to(merchRef.current, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: .9,
        });

        gsap.to(scrollRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 1.8,
        });

    }, []);

    const handleMouseEnter = () => {
        gsap.to(mainButtonRef.current, {
            width: 235,
            duration: 0.5,
            // delay: 0.1,
            ease: "power2.out",
            onUpdate: () => {
                if (mainButtonRef.current) {
                    mainButtonRef.current.style.justifyContent = 'center';
                }
            }
        });

        gsap.to(dotsButtonRef.current, {
            opacity: 0,
            duration: 0.5,
            // display: 'none',

            onComplete: () => {
                if (dotsButtonRef.current) dotsButtonRef.current.style.display = 'none';
            }
        });

    };

    const handleMouseLeave = () => {

        gsap.to(mainButtonRef.current, {
            width: 200,
            duration: 0.3,
            ease: "power2.out"
        });

        if (dotsButtonRef.current) dotsButtonRef.current.style.display = 'flex';
        gsap.to(dotsButtonRef.current, {
            opacity: 1,
            duration: 0.2,
            // delay: 0.1
        });
    };


    return (
        <div className="relative w-full h-screen">
            <Canvas className="absolute inset-0">
                <ambientLight intensity={0.5} color="#404040" />
                <directionalLight position={[5, 5, 15]} intensity={2} />
                <pointLight
                    position={[10, 10, 10]}
                    intensity={1.5}
                    color="#FF5304"
                    distance={20}
                    decay={1}
                />
                <pointLight
                    position={[-10, -10, -10]}
                    intensity={0.8}
                    color="#00a2ff"
                    distance={15}
                />
                <pointLight
                    position={[0, 10, -5]}
                    intensity={0.5}
                    color="#ffffff"
                    distance={10}
                />
                <EnvironmentMap preset="city" />
                <Phx />
            </Canvas>

            <div className="absolute w-[514px] h-[153px] right-10 top-1/4">
                <p
                    ref={titleRef}
                    className="opacity-0 font-geist font-semibold text-[64px] leading-[80%] tracking-[-0.06em] uppercase text-left effect-shine"
                >
                    from ashes to anthem the rise of phoenix
                </p>
            </div>

            <div className="px-10 py-4 absolute bottom-0 left-0 flex w-full justify-between items-end">
                <div className="w-[491px] opacity-0" ref={merchRef}>
                    <p className="text-left font-inter text-5xl font-light my-4">New Merch Out Now</p>
                    <div
                        className="relative flex items-center"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{ width: 235, height: 60 }}
                    >
                        <button
                            ref={mainButtonRef}
                            className={`absolute left-0 top-0 h-[60px] font-inter tracking-[0.06em] uppercase rounded font-extrabold text-[16px] transition-all duration-300 flex items-center justify-center z-20 hover:bg-[#FF5304] hover:cursor-pointer bg-white text-[#2F2F2F]`}
                            style={{ width: 200 }}
                        >
                            CHECKOUT MERCH
                        </button>

                        <button
                            ref={dotsButtonRef}
                            className={`absolute right-0 top-0 h-[60px] w-[30px] rounded flex items-center justify-center z-10 transition-all duration-300 bg-white`}
                        >
                            <div className="relative w-3 h-4">
                                <span className="absolute top-0 left-0 w-1 h-1 rounded-full bg-[#2F2F2F]"></span>
                                <span className="absolute bottom-0 left-0 w-1 h-1 rounded-full bg-[#2F2F2F]"></span>
                                <span className="absolute top-1/2 right-0 w-1 h-1 rounded-full bg-[#2F2F2F] transform -translate-y-1/2"></span>
                            </div>
                        </button>
                    </div>
                </div>

                <p ref={scrollRef} className="opacity-0 absolute bottom-6 left-1/2 -translate-x-1/2 font-inter font-extralight">
                    [ Scroll More ]
                </p>
                <div ref={imageRef} className="opacity-0">
                    <Image src="/img/branding_one.jpg" alt="Cover Phoenix" width={210} height={210} />
                </div>

            </div>
        </div>
    )
}
