import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderMaterial, Vector3 } from "three";

export const RainbowNoiseMaterial = () => {
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new Vector3(1, 1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 resolution;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Noise function
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float n = i.x + i.y * 57.0 + 113.0 * i.z;
          return mix(
            mix(mix(sin(n), sin(n + 1.0), f.x),
                mix(sin(n + 57.0), sin(n + 58.0), f.x), f.y),
            mix(mix(sin(n + 113.0), sin(n + 114.0), f.x),
                mix(sin(n + 170.0), sin(n + 171.0), f.x), f.y), f.z);
        }
        
        // HSV to RGB conversion
        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
          vec3 pos = vPosition * 2.0 + time * 0.5;
          
          float n1 = noise(pos * 4.0);
          float n2 = noise(pos * 8.0) * 0.5;
          float n3 = noise(pos * 16.0) * 0.25;
          
          float finalNoise = n1 + n2 + n3;
          
          // Create rainbow colors based on noise and position
          float hue = finalNoise * 0.5 + time * 0.3 + vUv.x * 0.5;
          vec3 color = hsv2rgb(vec3(hue, 0.8, 0.9));
          
          // Add some glow effect
          float glow = pow(1.0 - length(vUv - 0.5) * 2.0, 1.0);
          color += glow * 0.3;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }, []);

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime;
  });

  return <primitive object={material} attach="material" />;
}; 