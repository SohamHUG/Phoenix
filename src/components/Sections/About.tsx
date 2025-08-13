"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import AnimatedSVG from "../ui/AnimatedSVG";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { descriptions } from "@/Utils/DescAbout";

if (typeof window !== "undefined") {
    gsap.registerPlugin(DrawSVGPlugin);
    // gsap.registerPlugin(ScrollTrigger);
}

export default function About({ active }: { active: boolean }) {
    const [activeId, setActiveId] = useState(1);
    const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
    const activeItem = descriptions.find((d) => d.id === activeId)!;
    const sectionRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Timeline>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        // const ctx = gsap.context(() => {
        //     // Création de l'animation
        //     animationRef.current = gsap.timeline({ paused: true })
        //         .from(".test-1", {
        //             y: 3000,
        //             opacity: 0,  // Changé à 0 pour le fade-in
        //             duration: 1,
        //             ease: "power3.out"
        //         })
        //         .from(".test-2", {
        //             y: 5000,
        //             opacity: 0,  // Changé à 0 pour le fade-in
        //             duration: 0.9,
        //             ease: "power3.out"
        //         }, "-=0.4");

        //     ScrollTrigger.create({
        //         trigger: sectionRef.current,
        //         start: "top bottom",  // Déclenche quand le haut de la section atteint le bas de l'écran
        //         end: "bottom top",    // Fin quand le bas de la section atteint le haut de l'écran
        //         onEnter: () => {
        //             if (!hasAnimated.current) {
        //                 animationRef.current?.play();
        //                 hasAnimated.current = true;
        //             }
        //         },
        //         onEnterBack: () => {
        //             animationRef.current?.reverse();
        //         },
        //         onLeave: () => {
        //             // Ne rien faire en descendant
        //         },
        //         onLeaveBack: () => {
        //             animationRef.current?.progress(0).pause();
        //             hasAnimated.current = false;
        //         }
        //     });

        // }, sectionRef);

        // return () => {
        //     ctx.revert();
        //     hasAnimated.current = false;
        // };
    }, []);


    return (
        <div ref={sectionRef} className="flex flex-col items-start justify-center w-full h-full mt-6">
            <div className="test-1 flex items-center">
                <p className="flex justify-start items-center font-geist font-semibold leading-[80%] tracking-[-0.06em] text-5xl border-[0.5px] border-[#AAAAAA] py-[65px] px-[48px] h-[230px] w-[1009px]">
                    <span className="w-[514px] text-left">
                        WE’RE HERE TO SET THE WORLD ON FIRE WITH SOUND
                    </span>
                </p>
                <p className="relative flex justify-start items-start font-inter font-medium leading-[80%] tracking-[-0.06em] text-2xl text-[#AAAAAA] border-t-[0.5px] border-r-[0.5px] border-b-[0.5px] border-[#AAAAAA] px-[52px] py-[66px] w-[858px] h-[230px]">
                    <span>
                        [ MEET PHOENIX ]
                    </span>

                    <span className="absolute bottom-[-1] right-[-1] w-[457px] h-[36px] p-2.5 bg-[#FF5304] text-white font-inter font-normal leading-[100%] tracking-[-0.04em] text-sm">
                        KNOW MORE
                    </span>
                </p>
            </div>

            <div className="test-2">

                <div className="flex">

                    <div className="relative flex-1 flex items-center justify-center w-[1009px] h-[540px]">
                        <p className="px-[48px] pt-5 absolute top-0 left-0 text-4xl font-semibold font-geist leading-[80%] tracking-[-0.06em]">/WHAT WE DO</p>
                        <AnimatedSVG svg={activeItem.svg} />
                    </div>

                    <div className=" grid grid-cols-2 max-w-[858px] max-h-[540px] border-r-[0.5px] border-[#AAAAAA]">
                        {descriptions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveId(item.id)}
                                className={`group flex flex-col justify-between w-[430px] h-[270px] text-left border-l-[0.5px] border-b-[0.5px] p-[49px] transition-all duration-300 ${activeId === item.id
                                    ? "border-[#FF5304] bg-[#FF5304] text-white"
                                    : "border-[#AAAAAA] hover:bg-[#FF5304] hover:text-white hover:cursor-pointer bg-white"
                                    }`}
                            >
                                <h3 className="font-normal font-inter text-2xl leading-[100%] tracking-[-0.04em] flex gap-16">
                                    <span
                                        className={`${activeId === item.id
                                            ? "text-white"
                                            : "text-[#FF5304] group-hover:text-white"
                                            }`}
                                    >
                                        0{item.id}
                                    </span>
                                    <span>{item.title}</span>
                                </h3>
                                <p className="text-sm font-inter font-normal leading-[100%] tracking-[-0.04em] w-[333px]">
                                    {item.text}
                                </p>
                            </button>

                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
