"use client"

import { EnvironmentMap } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Phx from "../three/Phx"
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { title } from "process";
import { SplitText } from "gsap/SplitText";

export default function Hero({ scrollToMerch }: { scrollToMerch: () => void }) {
    const mainButtonRef = useRef<HTMLButtonElement>(null);
    const dotsButtonRef = useRef<HTMLButtonElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const merchRef = useRef<HTMLParagraphElement>(null);
    const scrollRef = useRef<HTMLParagraphElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {

        // gsap.set(titleRef.current, { x: 1000, opacity: 0 });
        gsap.set(imageRef.current, { x: 1000, opacity: 0 });
        gsap.set(merchRef.current, { x: -1000, opacity: 0 });
        gsap.set(scrollRef.current, { y: 100, opacity: 0 });


        const titleEl = titleRef.current?.querySelectorAll<HTMLElement>(".from-reveal") || [];
        const letters = new SplitText(titleEl).chars;

        [...titleEl].forEach((h1) => {
            h1.style.display = 'block'
        });

        gsap.from(letters, {
            y: 100,
            rotation: 10,
            duration: 0.5,
            stagger: 0.09,
            ease: "power3.inOut",
            delay: 0.9,
        },)

        // gsap.to(titleRef.current, {
        //     x: 0,
        //     opacity: 1,
        //     duration: 1,
        //     ease: "power3.out",
        //     delay: 0.5,
        // });

        gsap.to(imageRef.current, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 1.8,
        });

        gsap.to(merchRef.current, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 2.4,
        });

        gsap.to(scrollRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 3.1,
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
        <div className="relative w-full h-screen flex justify-center items-center">
            <Canvas
                className="absolute inset-0"
                // dpr={window.devicePixelRatio}
                style={{ height: 1500 }}
            // style={{ width: "100%", height: "100%" }}
            >
                <ambientLight intensity={2} color="#ffffff" />

                <directionalLight
                    position={[5, 5, 15]}
                    intensity={1.5}
                    color="#ffc362"
                    castShadow
                />

                <directionalLight
                    position={[7, -5, 15]}
                    intensity={1.5}
                    color="#FF5304"
                />

                <directionalLight
                    position={[0, 10, 15]}
                    intensity={1.5}
                    color="#f38415"
                />

                <directionalLight
                    position={[0, -10, 15]}
                    intensity={1.5}
                    color="#e82929"
                />

                <directionalLight
                    position={[-6, 1, 15]}
                    intensity={0.6}
                    color="#ff9072"
                />

                <directionalLight
                    position={[-5, -3, 15]}
                    intensity={0.2}
                    color="#3c296a"
                />

                <directionalLight
                    position={[-7, -10, 15]}
                    intensity={0.4}
                    color="#3c296a"
                />
                <EnvironmentMap preset="city" />

                <Phx />
            </Canvas>


            <div className="absolute w-[514px] h-[153px] right-10 top-1/4">
                <p
                    ref={titleRef}
                    className="font-geist font-semibold text-[64px] leading-[80%] tracking-[-0.06em] uppercase text-left effect-shine"
                >
                    <span className="from-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">from ashes to</span>
                    <span className="from-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">anthem the rise</span>
                    <span className="from-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">of phoenix</span>
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
                            onClick={scrollToMerch}
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
