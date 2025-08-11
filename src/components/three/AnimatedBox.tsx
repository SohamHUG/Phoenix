import React, { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { RainbowNoiseMaterial } from "./RainbowNoiseMaterial";

type AnimatedBoxProps = {
  position: [number, number, number];
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  color: string;
};

export const AnimatedBox = React.forwardRef<Mesh, AnimatedBoxProps>(
  ({ position, playing, setPlaying, color }, ref) => {
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    const floatingOffset = useRef({ x: 0, y: 0, z: 0 });
    const scrollProgress = useRef(0);

    useFrame((state, delta) => {
      if (ref && typeof ref !== 'function' && ref.current) {
        // Update floating animation offset
        floatingOffset.current.y = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
        
        // Get current scroll progress (0-1)
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress.current = Math.min(scrollY / maxScroll, 1);
        
        // Blend between floating and scroll-driven position
        const scrollInfluence = Math.min(scrollProgress.current * 2, 1); // Ramp up influence
        
        if (scrollInfluence < 1) {
          // Apply floating animation when not fully in scroll mode
          ref.current.position.x = position[0] + floatingOffset.current.x * (1 - scrollInfluence);
          ref.current.position.y = position[1] + floatingOffset.current.y * (1 - scrollInfluence);
          ref.current.position.z = position[2] + floatingOffset.current.z * (1 - scrollInfluence);
        }
        
        // Continuous rotation
        ref.current.rotation.z += delta * 0.5;
      }
    });

    return (
      <mesh
        ref={ref}
        position={position}
        scale={active ? 1.5 : hovered ? 1.1 : 1}
        onClick={() => {
          setActive(!active);
          setPlaying(!playing);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <RainbowNoiseMaterial />
      </mesh>
    );
  }
);

AnimatedBox.displayName = "AnimatedBox"; 