#define BLUR (0.1)

#define ARM_COUNT (1.)
#define WARP (.11) // How far away the center is

#define WIDTH (.5)

vec4 opioids(vec2 uv, vec2 resolution, vec3 color, float time, float strength, float seed) {
	if (seed == 4.) {
		uv = (2.0 * uv - 1.0) * vec2(1.0, -1.0);
		uv /= resolution.xy / resolution.y;

		float a = atan(uv.x, uv.y) / PI * 7.;
		float r = length(uv) - time * 0.1;

		uv = abs(fract(vec2(a + r * min(2., 15.0), a - r * min(2., 15.0))) - 0.5);

		vec3 final = vec3(0.0);
		vec3 invertedColor = 1.0 - color * 0.1;
		vec3 color1 = color * 2.;
		vec3 color2 = vec3(1.0, 0.0, 0.0);
		if (color.r > 0.9 && color.g > 0.9 && color. b > 0.9) {
			color2 = vec3(1.0, 0.0, 1.0);
		} else if (color.r > 0.5 && color.g > 0.5 && color. b > 0.6) {
			color2 = vec3(1.0, 0.2, 0.2);
		} else if (color.r < 0.16 && color.g < 0.16 && color.b < 0.16) {
			color2 = vec3(0.5, 0.3, 0.9);
			color1 *= vec3(2.5, 2.3, 1.9);
		} else if (color.r >= 0.5) {
			color2 = vec3(0.0, 1.0, 0.0);
		} else if (color.b >= 0.75)  {
			color2 = vec3(1.0, 0.0, 0.0);
		} else if (color.g >= 0.75)  {
			color2 = vec3(0.0, 0.0, 1.0);
		}

		final = mix(uv.x * color1 * 0.5, uv.y * color2 * 0.5, 0.5);

		return vec4(
				vec3(final),
				1.0
			   );
		}

    vec2 coord = uv - vec2(0.5, 0.5);
    coord.y *= resolution.y / resolution.x;
    vec2 pixelatedCoord = uv - 0.5;

    float angle = atan(pixelatedCoord.y, pixelatedCoord.x);
    float dist = length(pixelatedCoord);

    angle += dist * 1.0 + log(dist + 1.0) * 2.0;
    float brightness = 0.25 + 0.25 *
	    sin(24.0 * angle + dist * PI + sin(angle * 1.0) *
			    (dist + (0.5 + 0.5 * sin(-PI / 2.0 + 0. * PI))*mod(1., 2.0)) * 2.0 * PI)
	    +.25 + .25 * sin(pow(dist, 0.5) / 0.707 * PI * (5. + pow(seed, 2.)) - time * 0.1 * 2. * PI * 5.5);

    if (dist < 0.001) {
	    brightness *= (dist / 0.01);
    }

    if (brightness < min(strength * 1.5, 9.) / 700.0) {
	    // For white/bright colors, darken instead of invert to maintain visible effect
	    float colorBrightness = dot(color, vec3(0.299, 0.587, 0.114));
	    vec3 effectColor = mix(1.0 - color, color * 0.3, step(0.9, colorBrightness));
	    return vec4(effectColor, 1.0);
    } else {
	    return vec4(vec3(color), 1.0) * vec4(vec3(brightness) * 1.2, 0.8);
    }
}
