import { useRef, useEffect } from "react";
import { Mesh } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedBox } from "./AnimatedBox";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollDrivenBoxesProps = {
  playing: boolean;
  setPlaying: (playing: boolean) => void;
};

export function ScrollDrivenBoxes({ playing, setPlaying }: ScrollDrivenBoxesProps) {
  const group1Ref = useRef<Mesh>(null);
  const group2Ref = useRef<Mesh>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !group1Ref.current || !group2Ref.current) return;

    let ctx: any;

    const scrubValue = 1;

    ctx = gsap.context(() => {
      gsap.set(group1Ref.current!.position, { x: -2, y: 0, z: 0 });
      gsap.set(group2Ref.current!.position, { x: 2, y: 0, z: 0 });
      gsap.set([group1Ref.current, group2Ref.current], { 
        "scale.x": 1, 
        "scale.y": 1, 
        "scale.z": 1 
      });

      gsap.fromTo(group1Ref.current!.position, 
        { x: -2, y: 0, z: 0 },
        {
          x: 3.5,
          y: 2.5,
          z: 1.5,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: scrubValue,
            refreshPriority: -1,
          }
        }
      );

      gsap.fromTo(group2Ref.current!.position,
        { x: 2, y: 0, z: 0 },
        {
          x: -3.5,
          y: -2,
          z: -0.5,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: scrubValue,
            refreshPriority: -1,
          }
        }
      );

      gsap.to(group1Ref.current!.rotation, {
        x: Math.PI * 4.5,
        y: Math.PI * 3.5,
        z: Math.PI * 2.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: scrubValue,
          refreshPriority: -1,
        }
      });

      gsap.to(group2Ref.current!.rotation, {
        x: -Math.PI * 3.5,
        y: Math.PI * 4.5,
        z: -Math.PI * 2.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "body",
          start: "top top", 
          end: "bottom bottom",
          scrub: scrubValue,
          refreshPriority: -1,
        }
      });

      gsap.fromTo([group1Ref.current, group2Ref.current],
        { 
          "scale.x": 1,
          "scale.y": 1,
          "scale.z": 1
        },
        {
          "scale.x": 1.5,
          "scale.y": 1.5,
          "scale.z": 1.5,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "50% bottom",
            scrub: scrubValue,
            refreshPriority: -1,
          }
        }
      );
    });

    return () => ctx?.revert();
  }, []);

  return (
    <>
      <AnimatedBox 
        ref={group1Ref}
        position={[-2, 0, 0]} 
        playing={playing} 
        setPlaying={setPlaying}
        color="var(--primary)"
      />
      <AnimatedBox 
        ref={group2Ref}
        position={[2, 0, 0]} 
        playing={playing} 
        setPlaying={setPlaying}
        color="var(--secondary)"
      />
    </>
  );
} 