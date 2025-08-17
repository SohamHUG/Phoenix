"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import AnimatedSVG from "../ui/AnimatedSVG";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { descriptions } from "@/Data/DescAbout";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
    gsap.registerPlugin(DrawSVGPlugin);
    gsap.registerPlugin(ScrollTrigger);
}

export default function About({ active }: { active: boolean }) {
    const [activeId, setActiveId] = useState(1);
    const activeItem = descriptions.find((d) => d.id === activeId)!;
    const sectionRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Timeline>(null);
    const hasAnimated = useRef(false);
    const [shouldDraw, setShouldDraw] = useState(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const title = sectionRef.current?.querySelectorAll<HTMLElement>(".title-reveal") || [];
            const whatWeDoEl = document.querySelectorAll<HTMLElement>(".what-we-do");
            const knowMoreEl = document.querySelectorAll<HTMLElement>(".know-more");
            const buttons = sectionRef.current?.querySelectorAll<HTMLElement>(".about-btn") || [];
            const letters = new SplitText(title).chars;
            const texts = sectionRef.current?.querySelectorAll<HTMLElement>(".about-text") || [];
            let lines: HTMLElement[] = [];

            if (texts.length) {
                texts.forEach((text) => {
                    const split = new SplitText(text, { type: "lines" });
                    lines.push(...(split.lines as HTMLElement[]));
                });
            }

            [...title].forEach((h1) => {
                h1.style.display = "block";
            });

            let words: HTMLElement[] = [];
            if (whatWeDoEl) {
                const splitWords = new SplitText(whatWeDoEl, { type: "words" });
                words = splitWords.words as HTMLElement[];
            }

            animationRef.current = gsap.timeline({ paused: true })
                .from(letters, {
                    y: 100,
                    rotation: 10,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power3.inOut",
                })
                .from(words, {
                    y: 50,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power3.out",
                })
                .fromTo(buttons,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.3,
                        stagger: 0.09,
                        ease: "power3.out",
                        onStart: () => setShouldDraw(true),
                    }, ">")
                .from(lines, {
                    y: 20,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power2.out",
                })
                .from(knowMoreEl, {
                    y: 20,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power2.out",
                });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                onEnter: () => {
                    if (!hasAnimated.current) {
                        animationRef.current?.play();
                        hasAnimated.current = true;
                    }
                },
                onLeaveBack: () => {
                    animationRef.current?.progress(0).pause(0);
                    hasAnimated.current = false;
                    setShouldDraw(false);
                },
            });
        }, sectionRef);

        return () => {
            ctx.revert();
            hasAnimated.current = false;
            setShouldDraw(false);
        };
    }, []);

    return (
        <div ref={sectionRef} className="flex flex-col items-start justify-center w-full h-full mt-11">
            <div className="flex flex-col lg:flex-row w-[97.9%] max-w-[97.9%]">
                <p className="flex flex-col leading-[80%] tracking-[-0.06em] font-geist font-semibold text-3xl sm:text-4xl md:text-5xl border border-[#AAAAAA] p-6 md:p-12 md:py-16 flex-1 h-full">
                    <span className="text-left">
                        <span className="title-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">WE’RE HERE TO SET THE</span>
                        <span className="title-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">WORLD ON FIRE WITH</span>
                        <span className="title-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">SOUND</span>
                    </span>
                </p>
                <p className="relative flex justify-start items-start font-inter text-[#AAAAAA] border-t border-r border-b border-[#AAAAAA] p-6 md:p-12 md:py-16 flex-1">
                    <span className="what-we-do font-inter font-medium text-2xl leading-[80%] tracking-[-0.06em]">[ MEET PHOENIX ]</span>
                    <span className="know-more absolute -bottom-1 right-0 w-full sm:w-[55%] text-center sm:text-left p-2.5 bg-[#FF5304] text-white text-sm">
                        KNOW MORE
                    </span>
                </p>
            </div>

            <div className="flex flex-col lg:flex-row w-[97.9%] max-w-[97.9%]">
                <div className="relative flex-1 flex items-center justify-center h-[300px] md:h-[540px] w-[48.95%]">
                    <p className="what-we-do px-2 absolute top-2 left-2 sm:px-8 sm:top-5 sm:left-3 text-xl sm:text-2xl md:text-4xl font-semibold font-geist leading-[80%] tracking-[-0.06em]">
                        /WHAT WE DO
                    </p>
                    {shouldDraw && <AnimatedSVG svg={activeItem.svg} />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 border-l border-r border-b border-[#AAAAAA] w-[50%]">
                    {descriptions.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveId(item.id)}
                            className={`cursor-pointer about-btn flex flex-col justify-between p-4 sm:p-12 transition-all duration-300 ${activeId === item.id
                                ? "border-[#FF5304] bg-[#FF5304] text-white"
                                : "border-[#AAAAAA] hover:bg-[#F2E4DE] bg-white"
                                }`}
                        >
                            <h3 className="font-inter font-normal text-lg sm:text-xl md:text-2xl flex gap-16 leading-[100%] tracking-[-0.04em]">
                                <span className={activeId === item.id ? "text-white" : "text-[#FF5304]"}>0{item.id}</span>
                                <span className="about-text">{item.title}</span>
                            </h3>
                            <p className="about-text text-left text-sm md:text-base mt-2 leading-[100%] tracking-[-0.04em]">{item.text}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
