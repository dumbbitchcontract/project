#include "./lib/common.frag";
#include "./lib/pixelate.frag";
#include "./lib/strobe.frag";
#include "./lib/neuralNoise.frag";

#include "./pharmacodynamics/nootropics.frag";
#include "./pharmacodynamics/anxiolytics.frag";
#include "./pharmacodynamics/empathogens.frag";
#include "./pharmacodynamics/opioids.frag";
#include "./pharmacodynamics/stimulants.frag";
#include "./pharmacodynamics/cannabinoids.frag";

varying vec2 vUv;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uSeed;
uniform float uAmount;
uniform float uTime;
uniform float uState;

void main() {
	vec4 effect = <SUBSTANCE_CLASS>(pixelate(vUv), uResolution, uColor, uTime, 1.0 + uAmount, uSeed);
	gl_FragColor = vec4(effect.rgb, 1.0);
}

