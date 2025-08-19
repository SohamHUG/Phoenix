"use client";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { div } from "three/tsl";

export default function NewsLetter({ active }: { active: boolean }) {

    const sectionRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Timeline>(null);
    const hasAnimated = useRef(false);


    useLayoutEffect(() => {
        const ctx = gsap.context(() => {

            const section = sectionRef.current;

            gsap.set(section, { backgroundColor: "#DEDFDF" });


            const texts = sectionRef.current?.querySelectorAll<HTMLElement>(".lines-reveal") || [];
            let lines: HTMLElement[] = [];

            if (texts.length) {
                texts.forEach((text) => {
                    const split = new SplitText(text, { type: "lines" });
                    lines.push(...(split.lines as HTMLElement[]));
                });
            }

            const formBox = sectionRef.current?.querySelector<HTMLElement>(".form-box") || [];

            const socialsBtn = sectionRef.current?.querySelectorAll<HTMLElement>(".socials-btn") || [];

            const credits = sectionRef.current?.querySelectorAll<HTMLElement>(".credits") || [];

            animationRef.current = gsap.timeline({
                paused: true,
                reversed: true
            })
                // .to(section, {
                //     background: "linear-gradient(252.44deg, #060200 0%, #FF5304 100%)",
                //     duration: 1.4,
                // })
                .from(formBox, {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                }, ">")
                .from(lines, {
                    y: 50,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power2.out"
                }, ">")
                .fromTo(socialsBtn, {
                    y: 100,
                    opacity: 0,
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.09,
                    ease: "power2.out"
                }, ">")
                .from(credits, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    // stagger: 0.09,
                    ease: "power2.out"
                }, ">")

        }, sectionRef);

        return () => {
            ctx.revert();
            hasAnimated.current = false;
        };
    }, []);

    useEffect(() => {
        if (active) {
            animationRef.current?.play();
            hasAnimated.current = true;
        } else {
            animationRef.current?.reverse();
        }
    }, [active]);



    return (
        <div ref={sectionRef} className="sec flex items-end w-full h-full min-h-screen overflow-hidden">
            <div className="w-[95.8%] h-full mx-auto flex flex-col gap-5 justify-end"
                style={{
                    // backgroundImage: "url('/img/newsletter-bg.png')",
                    // backgroundSize: "calc(1200px * (100vw / 1920)) auto",
                    // backgroundSize: "cover",
                }}>

                <div className="flex w-full h-[65%] gap-2">
                    {/* image center */}
                    <div className="flex-[3] overflow-hidden order-2 transition-all duration-500 peer group hover:flex-[10]">
                        <img
                            src="/img/newsletter-bg.png"
                            alt="female singer"
                            className="w-full min-h-full object-cover group-hover:object-center"
                        />
                    </div>

                    {/* image left */}
                    <div className="flex-1 overflow-hidden order-1 transition-all duration-500 peer-hover:flex-[0] peer-hover:opacity-0">
                        <img
                            src="/img/singer-left.png"
                            alt="singer left"
                            className="w-full min-h-full object-cover grayscale"
                        />
                    </div>

                    {/* image right */}
                    <div className="flex-1 overflow-hidden order-3 transition-all duration-500 peer-hover:flex-[0] peer-hover:opacity-0">
                        <img
                            src="/img/singer-right.png"
                            alt="singer right"
                            className="w-full min-h-full object-cover grayscale"
                        />
                    </div>
                </div>

                <div className="bg-[#C6C6C6] flex justify-between p-8 mb-3">
                    <div className="form-box w-[35%] flex flex-col gap-5">
                        <p className="font-geist font-semibold text-2xl leading-[80%] tracking-[-0.06em] lines-reveal text-[#2F2F2F]">
                            JOIN THE PHOENIX RISING
                        </p>
                        <p className="font-inter font-normal text-sm lines-reveal w-[70%] text-[#2F2F2F]">
                            Be the first to hear new tracks, get early merch drops, and exclusive content.
                        </p>

                        <div className=" w-full flex items-end lines-reveal">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-[55%] py-2 border-b placeholder:text-[#2F2F2F] border-[#2F2F2F] placeholder:font-inter placeholder:font-normal placeholder:text-sm"
                            />
                            <button className="py-2 px-3 bg-[#2F2F2F] text-white hover:cursor-pointer hover:bg-white hover:text-[#2F2F2F] transition-all duration-300 font-inter font-normal tracking-[-0.02em] text-sm">
                                Submit
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col justify-around items-end">
                        <div className="flex gap-3">
                            <button className="font-inter font-medium text-sm sm:text-base md:text-lg tracking-[-0.06em] text-[#2F2F2F] p-6 bg-[#00000005] rounded-[8px] transition-all duration-300 hover:bg-[#2F2F2F] hover:text-white hover:cursor-pointer socials-btn">
                                LINKEDIN
                            </button>
                            <button className="font-inter font-medium text-sm sm:text-base md:text-lg tracking-[-0.06em] text-[#2F2F2F] p-6 bg-[#00000005] rounded-[8px] transition-all duration-300 hover:bg-[#2F2F2F] hover:text-white hover:cursor-pointer socials-btn">
                                CONTACT US
                            </button>
                            <button className="font-inter font-medium text-sm sm:text-base md:text-lg tracking-[-0.06em] text-[#2F2F2F] p-6 bg-[#00000005] rounded-[8px] transition-all duration-300 hover:bg-[#2F2F2F] hover:text-white hover:cursor-pointer socials-btn">
                                INSTAGRAM
                            </button>
                        </div>
                        <p className="text-[#2F2F2F] font-light font-inter tracking-[-0.04em] text-xs credits">Design By Gaurav Mali | Developed By Soham HUGUENIN</p>
                    </div>
                </div>

            </div>
        </div >
    );
}
