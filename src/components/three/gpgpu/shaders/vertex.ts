export const vertex = ` varying vec2 vUv;
varying vec3 vPosition;

uniform float uParticleSize;
uniform sampler2D uPositionTexture;


void main() {
	vUv = uv;

	vec3 newpos = position;

	vec4 color = texture2D( uPositionTexture, vUv );


	newpos.xyz = color.xyz;

	vPosition = newpos;

	vec4 mvPosition = modelViewMatrix * vec4( newpos, 1.0 );

	gl_PointSize = ( uParticleSize / -mvPosition.z ) * 2.5;

	gl_Position = projectionMatrix * mvPosition;
}`;