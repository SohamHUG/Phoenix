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
                .to(section, {
                    background: "linear-gradient(252.44deg, #060200 0%, #FF5304 100%)",
                    duration: 1.4,
                })
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
        <div ref={sectionRef} className="sec flex justify-center w-full h-full min-h-screen items-center overflow-hidden">
            <div className="w-[1824px] h-[783px] rounded-xl bg-center bg-cover mx-auto mt-15 p-5 flex flex-col justify-between"
                style={{ backgroundImage: "url('/img/newsletter-bg.png')" }}>

                <div className="bg-black/40 w-[521px] py-20 px-10 rounded-3xl flex flex-col gap-6 form-box">
                    <p className="font-geist font-semibold text-4xl leading-[80%] tracking-[-0.06em] text-white lines-reveal">JOIN THE PHOENIX RISING</p>
                    <p className="text-white font-inter font-normal text-xl lines-reveal">Be the first to hear new tracks, get early merch drops, and exclusive content.</p>

                    <span className="lines-reveal w-full">
                        <input type="email" placeholder="Enter your email" className="w-full border-b border-white placeholder:text-white placeholder:font-inter placeholder:font-normal placeholder:text-xl" />
                    </span>

                    <div className="lines-reveal w-full flex justify-end">
                        <button className="py-2 px-3 bg-white rounded-4xl hover:cursor-pointer hover:bg-black/5 hover:text-white transition-all duration-300 font-inter font-normal tracking-[-0.02em] text-xl">Submit</button>
                    </div>
                </div>

                <div className="flex justify-between items-end w-full">

                    <div className="w-1/3"></div>

                    <p className="font-inter font-light text-sm text-white w-1/3 credits text-center">
                        Copyright: “© 2025 Phoenix / B-WEEK Entertainment. All Rights Reserved.”
                    </p>

                    <div className="flex flex-col gap-5 w-1/3 items-end">
                        <div className="flex gap-3">
                            <button className="font-inter font-medium text-[16px] tracking-[-0.06em] text-white p-6 bg-[#E8E7DE05] rounded-[8px] transition-all duration-300 hover:bg-white hover:text-black hover:cursor-pointer socials-btn">
                                LINKEDIN
                            </button>
                            <button className="font-inter font-medium text-[16px] tracking-[-0.06em] text-white p-6 bg-[#E8E7DE05] rounded-[8px] transition-all duration-300 hover:bg-white hover:text-black hover:cursor-pointer socials-btn">
                                CONTACT US
                            </button>
                            <button className="font-inter font-medium text-[16px] tracking-[-0.06em] text-white p-6 bg-[#E8E7DE05] rounded-[8px] transition-all duration-300 hover:bg-white hover:text-black hover:cursor-pointer socials-btn">
                                INSTAGRAM
                            </button>
                        </div>
                        <p className="text-white font-light font-inter tracking-[-0.04em] text-xs credits">Design By Gaurav Mali | Developed By Soham HUGUENIN</p>
                    </div>
                </div>



            </div>
        </div>
    );
}
