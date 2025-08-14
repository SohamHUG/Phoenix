"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
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
    const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
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
                h1.style.display = 'block'
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
                    ease: "power3.inOut"
                },)
                .from(words, {
                    y: 50,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power3.out"
                },)
                .fromTo(buttons,
                    { opacity: 0, },
                    {
                        opacity: 1,
                        duration: 0.3,
                        stagger: 0.09,
                        ease: "power3.out",
                        onStart: () => setShouldDraw(true),
                    }, ">"
                )
                .from(lines, {
                    y: 20,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power2.out"
                },)
                .from(knowMoreEl, {
                    y: 20,
                    opacity: 0,
                    zIndex: -5,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power2.out"
                },)

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",  // Déclenche quand le haut de la section atteint le bas de l'écran
                end: "bottom top",    // Fin quand le bas de la section atteint le haut de l'écran
                onEnter: () => {
                    if (!hasAnimated.current) {
                        animationRef.current?.play();
                        hasAnimated.current = true;
                    }
                },
                onEnterBack: () => {
                    // animationRef.current?.reverse();
                },
                onLeave: () => {
                    // Ne rien faire en descendant
                },
                onLeaveBack: () => {
                    animationRef.current?.progress(0).pause();
                    hasAnimated.current = false;
                    setShouldDraw(false);
                }
            });

        }, sectionRef);

        return () => {
            ctx.revert();
            hasAnimated.current = false;
            setShouldDraw(false);
        };
    }, []);

    // useEffect(() => {

    //     if (active && !hasAnimated.current) {
    //         animationRef.current?.play();
    //         hasAnimated.current = true;
    //     } 
    // }, [active]);



    return (
        <div ref={sectionRef} className="flex flex-col items-start justify-center w-full h-full mt-6 animate">
            <div className="test-1 flex items-center">
                <p className="flex justify-start items-center font-geist font-semibold leading-[80%] tracking-[-0.06em] text-5xl border-[0.5px] border-[#AAAAAA] py-[65px] px-[48px] h-[230px] w-[1009px]">
                    <span className="w-[514px] text-left">
                        <span className="title-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">WE’RE HERE TO SET THE</span>
                        <span className="title-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">WORLD ON FIRE WITH</span>
                        <span className="title-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">SOUND</span>
                    </span>
                </p>
                <p className="relative flex justify-start items-start font-inter font-medium leading-[80%] tracking-[-0.06em] text-2xl text-[#AAAAAA] border-t-[0.5px] border-r-[0.5px] border-b-[0.5px] border-[#AAAAAA] px-[52px] py-[66px] w-[858px] h-[230px]">
                    <span className="what-we-do">
                        [ MEET PHOENIX ]
                    </span>

                    <span className="know-more absolute bottom-[-1] right-[-1] w-[457px] h-[36px] p-2.5 bg-[#FF5304] text-white font-inter font-normal leading-[100%] tracking-[-0.04em] text-sm">
                        KNOW MORE
                    </span>
                </p>
            </div>

            <div className="test-2">

                <div className="flex">

                    <div className="relative flex-1 flex items-center justify-center w-[1009px] h-[540px]">
                        <p className="what-we-do px-[48px] pt-5 absolute top-0 left-0 text-4xl font-semibold font-geist leading-[80%] tracking-[-0.06em]">
                            /WHAT WE DO
                        </p>

                        {shouldDraw &&
                            <AnimatedSVG svg={activeItem.svg} />
                        }
                    </div>

                    <div className=" grid grid-cols-2 max-w-[858px] max-h-[540px] border-r-[0.5px] border-[#AAAAAA]">
                        {descriptions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveId(item.id)}
                                className={`about-btn opacity-100 flex flex-col justify-between w-[430px] h-[270px] text-left border-l-[0.5px] border-b-[0.5px] p-[49px] transition-all duration-300 ${activeId === item.id
                                    ? "border-[#FF5304] bg-[#FF5304] text-white"
                                    : "border-[#AAAAAA] hover:bg-[#F2E4DE] hover:cursor-pointer bg-white"
                                    }`}
                            >
                                <h3 className="font-normal font-inter text-2xl leading-[100%] tracking-[-0.04em] flex gap-16">
                                    <span
                                        className={`${activeId === item.id
                                            ? "text-white"
                                            : "text-[#FF5304] "
                                            }`}
                                    >
                                        0{item.id}
                                    </span>
                                    <span className="about-text">{item.title}</span>
                                </h3>
                                <p className="about-text text-sm font-inter font-normal leading-[100%] tracking-[-0.04em] w-[333px]">
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
