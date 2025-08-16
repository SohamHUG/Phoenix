export const fragment = ` precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocityTexture;
void main() {
    float center = length(gl_PointCoord - 0.5);
    vec3 velocity = texture2D(uVelocityTexture, vUv).xyz * 100.0;
    float velocityAlpha = clamp(length(velocity), 0.04, 0.8);
    if (center > 0.5) { discard; }
// red
// gl_FragColor = vec4(0.909804, 0.160784, 0.160784, velocityAlpha);

// yellow
// gl_FragColor = vec4(255.0/255.0, 195.0/255.0, 98.0/255.0, velocityAlpha);

// orange
// gl_FragColor = vec4(243.0/255.0, 132.0/255.0, 21.0/255.0, velocityAlpha);

// peach
// gl_FragColor = vec4(255.0/255.0, 144.0/255.0, 114.0/255.0, velocityAlpha);

// white
 gl_FragColor = vec4(1.0, 1.0, 1.0, velocityAlpha);

// red pink
// gl_FragColor = vec4(225.0/255.0, 17.0/255.0, 46.0/255.0, velocityAlpha);

// beige
// gl_FragColor = vec4(255.0/255.0, 223.0/255.0, 166.0/255.0, velocityAlpha);

// purple light
// gl_FragColor = vec4(164.0/255.0, 92.0/255.0, 255.0/255.0, velocityAlpha);

// cyan
// gl_FragColor = vec4(0.0/255.0, 229.0/255.0, 255.0/255.0, velocityAlpha);

// #F2F2F2
// gl_FragColor = vec4(242.0/255.0, 242.0/255.0, 242.0/255.0, velocityAlpha);

}
	`;