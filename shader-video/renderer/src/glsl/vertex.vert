varying vec2 vUv;
varying vec2 vNormal;

void main() {
	vUv = uv;
	vNormal = vNormal;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

