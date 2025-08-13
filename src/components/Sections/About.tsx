"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import AnimatedSVG from "../ui/AnimatedSVG";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(DrawSVGPlugin);
    gsap.registerPlugin(ScrollTrigger);
}

const descriptions = [
    {
        id: 1,
        title: "EDM",
        text: "We craft high-energy EDM with driving beats, powerful basslines, and dynamic drops, delivering music that excites, engages, and energizes. Every track is produced to captivate audiences, ignite emotion, and leave a lasting impact.",
        svg:
            `<svg width="400" height="300" viewBox="0 0 439 347" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M312.312 281.438L343.188 250.562V80.75M19 19H420.375V327.75H19V19ZM281.438 173.375C281.438 233.056 233.056 281.438 173.375 281.438C113.694 281.438 65.3125 233.056 65.3125 173.375C65.3125 113.694 113.694 65.3125 173.375 65.3125C233.056 65.3125 281.438 113.694 281.438 173.375ZM204.25 173.375C204.25 190.427 190.427 204.25 173.375 204.25C156.323 204.25 142.5 190.427 142.5 173.375C142.5 156.323 156.323 142.5 173.375 142.5C190.427 142.5 204.25 156.323 204.25 173.375ZM358.625 80.75C358.625 89.2759 351.713 96.1875 343.188 96.1875C334.662 96.1875 327.75 89.2759 327.75 80.75C327.75 72.2241 334.662 65.3125 343.188 65.3125C351.713 65.3125 358.625 72.2241 358.625 80.75Z" stroke="#FF5025" stroke-width="37" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`
        ,
    },
    {
        id: 2,
        title: "Synthwave",
        text: "We craft nostalgic yet futuristic Synthwave with lush synths, atmospheric textures, and retro-inspired melodies, delivering music that inspires, immerses, and connects. Every track is produced to transport listeners into a vivid, cinematic world.",
        svg:
            `<svg width="400" height="400" viewBox="-15 -15 471 412" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M433.283 43.5482C422.049 37.5218 412.405 28.8533 405.194 18.3984L392.503 0L379.811 18.3984C372.6 28.8533 362.949 37.5218 351.715 43.5482C340.481 49.5829 327.695 52.9967 313.998 53.005C300.3 52.9967 287.522 49.5829 276.281 43.5482C265.054 37.5218 255.404 28.8533 248.192 18.3984L235.501 0L222.809 18.3984C215.597 28.8533 205.947 37.5218 194.721 43.5482C183.479 49.5829 170.702 52.9967 157.004 53.005C143.306 52.9967 130.521 49.5829 119.287 43.5482C108.053 37.5218 98.4022 28.8533 91.19 18.3984L78.4988 0L65.8075 18.3984C58.5935 28.8533 48.9509 37.5218 37.7168 43.5482C26.4827 49.5829 13.6976 52.9967 0 53.005V83.838C18.8667 83.8463 36.7417 79.0903 52.3104 70.7171C62.0009 65.5104 70.8183 58.9063 78.4969 51.1817C86.1838 58.9072 94.993 65.5104 104.683 70.7171C120.26 79.0903 138.128 83.8463 157.002 83.838C175.868 83.8463 193.736 79.0903 209.313 70.7171C219.003 65.5104 227.82 58.9063 235.499 51.1817C243.178 58.9072 251.995 65.5104 261.686 70.7171C277.262 79.0903 295.129 83.8463 313.996 83.838C332.87 83.8463 350.738 79.0903 366.315 70.7171C376.005 65.5104 384.814 58.9063 392.501 51.1817C400.18 58.9072 408.997 65.5104 418.688 70.7171C434.256 79.0903 452.131 83.8463 470.998 83.838V53.005C457.302 52.9967 444.517 49.5829 433.283 43.5482Z" stroke="#FF5025" stroke-width="37" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M405.194 182.41L392.503 164.011L379.811 182.41C372.6 192.865 362.949 201.526 351.715 207.559C340.481 213.594 327.696 217.008 313.998 217.008C300.3 217.008 287.523 213.593 276.281 207.559C265.054 201.526 255.404 192.865 248.192 182.41L235.501 164.011L222.809 182.41C215.598 192.865 205.947 201.526 194.721 207.559C183.479 213.594 170.702 217.008 157.004 217.008C143.306 217.008 130.521 213.593 119.287 207.559C108.053 201.526 98.4023 192.865 91.1901 182.41L78.4989 164.011L65.8076 182.41C58.5955 192.865 48.9528 201.526 37.7188 207.559C26.4847 213.594 13.6996 217.008 0.00195312 217.008V247.849C18.8686 247.849 36.7436 243.093 52.3124 234.728C62.0028 229.522 70.8203 222.918 78.4989 215.185C86.1858 222.918 94.9949 229.522 104.685 234.728C120.261 243.094 138.13 247.849 157.004 247.849C175.87 247.849 193.738 243.093 209.315 234.728C219.005 229.522 227.822 222.918 235.501 215.185C243.18 222.918 251.997 229.522 261.688 234.728C277.264 243.094 295.131 247.849 313.998 247.849C332.872 247.849 350.74 243.093 366.317 234.728C376.007 229.522 384.816 222.918 392.503 215.185C400.182 222.918 408.999 229.522 418.69 234.728C434.258 243.094 452.133 247.849 471 247.849V217.008C457.302 217.008 444.517 213.593 433.283 207.559C422.049 201.526 412.405 192.865 405.194 182.41Z" stroke="#FF5025" stroke-width="37" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M405.194 346.421L392.503 328.023L379.811 346.421C372.6 356.875 362.949 365.537 351.715 371.57C340.481 377.605 327.695 381.019 313.998 381.019C300.3 381.019 287.522 377.604 276.281 371.57C265.054 365.536 255.404 356.875 248.192 346.421L235.501 328.023L222.809 346.421C215.597 356.875 205.947 365.537 194.721 371.57C183.479 377.605 170.702 381.019 157.004 381.019C143.306 381.019 130.521 377.604 119.287 371.57C108.053 365.536 98.4022 356.875 91.19 346.421L78.4988 328.023L65.8075 346.421C58.5935 356.875 48.9509 365.536 37.7168 371.57C26.4827 377.605 13.6976 381.019 0 381.019V411.86C18.8667 411.86 36.7417 407.104 52.3104 398.732C62.0009 393.523 70.8183 386.929 78.4969 379.195C86.1838 386.928 94.993 393.523 104.683 398.732C120.26 407.104 138.128 411.86 157.002 411.86C175.868 411.86 193.736 407.104 209.313 398.732C219.003 393.523 227.82 386.929 235.499 379.195C243.178 386.928 251.995 393.523 261.686 398.732C277.262 407.104 295.129 411.86 313.996 411.86C332.87 411.86 350.738 407.104 366.315 398.732C376.005 393.523 384.814 386.929 392.501 379.195C400.18 386.928 408.997 393.523 418.688 398.732C434.256 407.104 452.131 411.86 470.998 411.86V381.019C457.301 381.019 444.515 377.604 433.281 371.57C422.049 365.536 412.405 356.875 405.194 346.421Z" stroke="#FF5025" stroke-width="37" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`

    },
    {
        id: 3,
        title: "Indie Rock",
        text: "We craft authentic Indie Rock with raw vocals, vibrant guitar riffs, and rhythmic grooves, delivering music that resonates, uplifts, and engages. Every track is produced to tell a story, evoke emotion, and connect deeply.",
        svg: `
            <svg width="518" height="418" viewBox="-15 -15 548 448" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    d="M388.356 62.0625L402.25 46.625L371.375 15.75L355.938 29.6438V0.3125H325.062V31.1875H354.224L325.062 57.4312V31.1875H294.188V62.0625H319.922L235.973 136.379L0.875 237.139V291.572L110.728 307.272L126.428 417.125H180.861L281.621 182.027L355.938 98.0782V123.812H386.812V92.9375H360.569L386.812 63.7761V92.9375H417.688V62.0625H388.356ZM160.514 386.25H153.197L138.022 279.978L31.75 264.803V257.486L228.902 172.996L244.988 189.082L160.514 386.25ZM139.812 225.484L192.516 278.188L170.688 300.016L117.984 247.312L139.812 225.484Z" 
                    stroke="#FF5025" 
                    stroke-width="20" 
                    stroke-miterlimit="10" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                />
            </svg>

        `,
    },
    {
        id: 4,
        title: "Custom music",
        text: "We craft bespoke music across any genre, mood, or style, delivering sound that reflects your vision, brand, and story. Every track is produced to align perfectly with your needs, captivate audiences, and create memorable experiences.",
        svg: `
            <svg width="500" height="345" viewBox="-15 -15 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M392.812 0.1875H104.75V209.688H78.5625C35.1737 209.688 0 244.86 0 288.25C0 331.64 35.1737 366.812 78.5625 366.812C121.951 366.812 157.125 331.64 157.125 288.25V104.938H340.438V209.688H314.25C270.86 209.688 235.688 244.86 235.688 288.25C235.688 331.64 270.86 366.812 314.25 366.812C357.64 366.812 392.812 331.64 392.812 288.25V0.1875Z" stroke="#FF5025" stroke-width="37" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        `,
    },
];

export default function About() {
    const [activeId, setActiveId] = useState(1);
    const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
    const activeItem = descriptions.find((d) => d.id === activeId)!;


    return (
        <div className="flex flex-col items-start justify-center w-full h-full mt-6">
            <div className="flex items-center">
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

            <div className="">

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
