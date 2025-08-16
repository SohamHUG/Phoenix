export const fragment = ` precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocityTexture;
void main() {
    float center = length(gl_PointCoord - 0.5);
    vec3 velocity = texture2D(uVelocityTexture, vUv).xyz * 100.0;
    float velocityAlpha = clamp(length(velocity), 0.04, 0.8);
    if (center > 0.5) { discard; }
// red #e82929
// gl_FragColor = vec4(0.909804, 0.160784, 0.160784, velocityAlpha);

// yellow #ffc362
// gl_FragColor = vec4(255.0/255.0, 195.0/255.0, 98.0/255.0, velocityAlpha);

// orange #f38415
// gl_FragColor = vec4(243.0/255.0, 132.0/255.0, 21.0/255.0, velocityAlpha);

// peach #ff9072
// gl_FragColor = vec4(255.0/255.0, 144.0/255.0, 114.0/255.0, velocityAlpha);

// white #fff
// gl_FragColor = vec4(1.0, 1.0, 1.0, velocityAlpha);

// red pink #e1112e
// gl_FragColor = vec4(225.0/255.0, 17.0/255.0, 46.0/255.0, velocityAlpha);

// beige #FFDFA6
// gl_FragColor = vec4(255.0/255.0, 223.0/255.0, 166.0/255.0, velocityAlpha);

// purple light #A45CFF
// gl_FragColor = vec4(164.0/255.0, 92.0/255.0, 255.0/255.0, velocityAlpha);

// cyan #00E5FF
// gl_FragColor = vec4(0.0/255.0, 229.0/255.0, 255.0/255.0, velocityAlpha);

// gray #F2F2F2
// gl_FragColor = vec4(242.0/255.0, 242.0/255.0, 242.0/255.0, velocityAlpha);

// gold #efbf04
gl_FragColor = vec4(239.0/255.0, 191.0/255.0, 4.0/255.0, velocityAlpha);

}
	`;