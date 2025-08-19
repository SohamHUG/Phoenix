"use client"

import { EnvironmentMap } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import Phx from "../three/Phx"
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { title } from "process";
import { SplitText } from "gsap/SplitText";
import * as THREE from 'three'
import { Particles } from "../three/Particles";
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

function SceneWrapper({ children }: { children: React.ReactNode }) {
    const ref = useRef<THREE.Group>(null)
    const mouse = useRef<[number, number]>([0, 0])

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mouse.current = [
                (e.clientX / window.innerWidth - 0.5) * 2,
                (e.clientY / window.innerHeight - 0.5) * 2,
            ]
        }
        window.addEventListener("mousemove", handleMouse)
        return () => window.removeEventListener("mousemove", handleMouse)
    }, [])

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.x += (mouse.current[1] * 0.2 - ref.current.rotation.x) * 0.3
            ref.current.rotation.y += (mouse.current[0] * 0.2 - ref.current.rotation.y) * 0.3
        }
    })

    return <group ref={ref}>{children}</group>
}

export default function Hero({ scrollToMerch, active }: { scrollToMerch: () => void, active: boolean }) {
    const mainButtonRef = useRef<HTMLButtonElement>(null);
    const dotsButtonRef = useRef<HTMLButtonElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const merchRef = useRef<HTMLParagraphElement>(null);
    const scrollRef = useRef<HTMLParagraphElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const isMobile = window.innerWidth < 768;
    const size = isMobile ? 256 : 550;

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
            {/* {active && ()} */}

            <Canvas
                className="absolute inset-0"
                // dpr={window.devicePixelRatio}
                // style={{ height: 1500 }}
                style={{ width: "100%", height: "100%" }}
                camera={{
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    position: [0, 0, 3]
                }}
                // scene={{ rotation: [Math.PI / 2, 0, 0] }}
                gl={{ alpha: true }}
                onCreated={({ gl, scene, camera }) => {
                    // scene.rotation.set(Math.PI / 2, 0, 0); 
                    gl.setClearColor(0x000000, 0);
                    camera.lookAt(0, 0, 0);

                }}
            >

                <SceneWrapper>
                    <ambientLight intensity={2} color="#ffffff" />

                    <directionalLight
                        position={[5, 5, 15]}
                        intensity={1.5}
                        color="#ffc362"
                        castShadow
                    />
                    <Phx size={size} />

                    <EffectComposer multisampling={0}>
                        <Bloom
                            intensity={1}             // force du glow
                            luminanceThreshold={0.2}
                            luminanceSmoothing={.6}
                            radius={0.3}
                            blendFunction={BlendFunction.SCREEN}
                        />
                    </EffectComposer>
                    {active && <Particles />}
                </SceneWrapper>
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
        </div >
    )
}
