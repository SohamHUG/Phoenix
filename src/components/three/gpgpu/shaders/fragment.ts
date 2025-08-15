// export const fragment = ` varying vec2 vUv;

// uniform sampler2D uVelocityTexture;


// void main() {
//     float center = length(gl_PointCoord - 0.5);

//     vec3 velocity = texture2D( uVelocityTexture, vUv ).xyz * 100.0;

//     float velocityAlpha = clamp(length(velocity.r), 0.04, 0.8);

//     if (center > 0.5) { discard; }


//     gl_FragColor = vec4(0.808, 0.647, 0.239, velocityAlpha);
// }
// }`;

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
 gl_FragColor = vec4(255.0/255.0, 195.0/255.0, 98.0/255.0, velocityAlpha);

// orange
// gl_FragColor = vec4(243.0/255.0, 132.0/255.0, 21.0/255.0, velocityAlpha);

// peach
// gl_FragColor = vec4(255.0/255.0, 144.0/255.0, 114.0/255.0, velocityAlpha);
}
	`;