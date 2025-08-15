export const simFragmentPositionShader = `void main() {
	vec2 vUv = gl_FragCoord.xy / resolution.xy;

	vec3 position = texture2D( uCurrentPosition, vUv ).xyz;
	vec3 velocity = texture2D( uCurrentVelocity, vUv ).xyz;

	position += velocity;

	gl_FragColor = vec4( position, 1.);
}`
