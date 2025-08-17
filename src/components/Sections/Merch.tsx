"use client"

import Image from "next/image";
import { products } from "@/Data/Products";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Merch({ active }: { active: boolean }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Timeline>(null);
    const hasAnimated = useRef(false);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const products = sectionRef.current?.querySelectorAll<HTMLElement>(".products") || [];
            const title = sectionRef.current?.querySelectorAll<HTMLElement>(".letter-reveal") || [];
            const letters = new SplitText(title).chars;

            [...title].forEach((h1) => {
                h1.style.display = 'block';
            });

            animationRef.current = gsap.timeline({
                paused: true,
                reversed: true
            })
                .fromTo(letters,
                    { y: 100, rotation: 10, opacity: 0 },
                    { y: 0, rotation: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power3.inOut" }
                )
                .fromTo(products,
                    { opacity: 0, y: 100 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, ">"
                )
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
        <div ref={sectionRef} className="w-full min-h-screen flex flex-col items-center justify-center mt-24 max-w-[95.8%] mx-auto">
            <div className=" w-full">
                {/* <img src="/img/merch/banner-merch.png" alt="Banner Phoenix" className="w-full h-auto" /> */}
                <div
                    className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-16 h-[19rem] bg-no-repeat bg-center bg-cover w-full"
                    style={{
                        backgroundImage: "url('/img/merch/banner-merch.png')",
                    }}
                >
                    <p className="font-geist font-semibold leading-[80%] tracking-[-0.06em] text-2xl sm:text-3xl md:text-4xl text-white w-full sm:w-[380px] effect-shine flex flex-col h-fit">
                        <span className="letter-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">/CHECKOUT OUR</span>
                        <span className="letter-reveal [clip-path:inset(0px_0px_0px_0px)] hidden">MERCH</span>
                    </p>
                    <Image src="/logo.svg" alt="logo phoenix" width={120} height={50} className="hidden sm:block absolute left-1/2 -translate-x-1/2" />
                    <p className="letter-reveal leading-[80%] tracking-[-0.06em] hidden font-geist font-semibold text-2xl sm:text-4xl text-white cursor-default effect-shine">
                        FLAT 50% OFF
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                {products.map((product, idx) => (
                    <div key={idx} className="relative overflow-hidden group products">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={300}
                            height={498}
                            className="w-auto h-auto object-cover transition-transform duration-500 group-hover:scale-75 group-hover:-translate-y-30"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-[14.5rem] bg-white/90 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-center gap-2.5">
                            <h3 className="font-inter font-normal text-lg sm:text-xl md:text-4xl">{product.name}</h3>
                            <p className="text-xs bg-[#E9E7DE] w-fit px-2 py-1 font-inter gap-2.5">
                                <Image src="/img/star.png" alt="star" width={10} height={10} className="inline-block mr-1" />
                                {product.rating}, {product.reviews}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="font-inter font-medium text-lg sm:text-xl">{product.price} USD</p>
                                <p className="font-inter font-normal text-xs line-through text-gray-400">{product.oldPrice}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
