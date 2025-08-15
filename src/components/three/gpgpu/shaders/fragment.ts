// export const fragment = ` precision highp float;
// varying vec2 vUv;

// uniform sampler2D uVelocityTexture;
// uniform vec3 uColor;
// uniform float uMinAlpha;
// uniform float uMaxAlpha;
// // uniform vec3 uColor = vec3(0.808, 0.647, 0.239);
// // uniform float uMinAlpha = 0.04;
// // uniform float uMaxAlpha = 0.8;


// void main() {
// 	float center = length(gl_PointCoord - 0.5);

// 	vec3 velocity = texture2D( uVelocityTexture, vUv ).xyz * 100.0;

// 	float velocityAlpha = clamp(length(velocity.r), uMinAlpha, uMaxAlpha);

// 	if (center > 0.5) { discard; }


// 	gl_FragColor = vec4(uColor, velocityAlpha);
// }`;

export const fragment = ` precision highp float;
varying vec2 vUv;
uniform sampler2D uVelocityTexture;
void main() {
    float center = length(gl_PointCoord - 0.5);
    vec3 velocity = texture2D(uVelocityTexture, vUv).xyz * 100.0;
    float velocityAlpha = clamp(length(velocity), 0.04, 0.8);
    if (center > 0.5) { discard; }
    gl_FragColor = vec4(1.0, 1.0, 1.0, velocityAlpha);
}
	`;