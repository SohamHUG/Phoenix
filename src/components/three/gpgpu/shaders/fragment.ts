export const fragment = ` precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocityTexture;
uniform float uOpacity;
void main() {
    float center = length(gl_PointCoord - 0.5);
    vec3 velocity = texture2D(uVelocityTexture, vUv).xyz * 100.0;
    float velocityAlpha = clamp(length(velocity), 0.04, 0.8);
    if (center > 0.5) { discard; }
// red
// vec3 baseColor = vec3(0.909804, 0.160784, 0.160784);

// yellow
 vec3 baseColor = vec3(255.0/255.0, 195.0/255.0, 98.0/255.0);

// orange
// vec3 baseColor = vec3(243.0/255.0, 132.0/255.0, 21.0/255.0);

// peach
// vec3 baseColor = vec3(255.0/255.0, 144.0/255.0, 114.0/255.0);

float alpha = velocityAlpha * uOpacity;

    gl_FragColor = vec4(baseColor, alpha);
}
	`;