vec4 empathogens(vec2 uv, vec2 resolution, vec3 color, float time, float strength, float seed) {
	vec2 ouv = uv;

	// Kaleidoscope effect for all seeds (1-5)
	vec2 center = uv - 0.5;
	float angle = atan(center.y, center.x);
	float radius = length(center);

	seed = 6.0 - seed;

	// Segments increase with seed: 4, 6, 8, 10, 12 (seed 5 is most intricate)
	float segments = 4.0 + seed * 2.0;
	float segmentAngle = 3.14159265359 * 2.0 / segments;
	float originalAngle = angle;
	angle = mod(angle, segmentAngle);
	// Mirror alternate segments
	if (mod(floor(originalAngle / segmentAngle), 2.0) == 1.0) {
		angle = segmentAngle - angle;
	}
	// Rotation based on seed
	angle += seed * 0.523598775598; // seed * PI/6

	uv = vec2(cos(angle), sin(angle)) * radius + 0.5;

	uv *= 1.5;
	uv.x -= 0.625;
	uv.x = abs(uv.x);
	uv.y -= 0.28867513459;
	vec2 n = vec2(sin(2.41799387799), cos(2.41799387799));
	uv -= n * max(.0, dot(uv - vec2(0.5, 0.0), n)) * 2.0;
	n = vec2(sin(2.09439510239 + 0.01 * seed * 10.), cos(2.09439510239 + 0.02 * seed * 10.));
	uv.x += 2.0;
	int seedInt = int(seed);
	for (int iters = 0; iters < 15 - seedInt; iters++) {
		uv *= 1.0 + 0.15 * 1.5;
		uv *= 0.95;
		uv.x -= 1.35;
		uv.y += 0.25;
		uv.x = abs(uv.x);
		uv.x -= 1.5;
		uv -= n * min(0.0, dot(uv, n)) * 2.0;
	}
	// Needs to be more vibrant?
	time *= min(2.1, 1.0 + 10. * strength);
	color *= 0.9;
	vec3 nn = vec3(
			neuralNoise(uv * 0.05 + time * 0.05, time * 0.02, color).r,
			neuralNoise(uv * 0.05 + time * 0.05, time * 0.03, color).g,
			neuralNoise(uv * 0.05 + time * 0.05, time * 0.05, color).b
		      );
	return vec4(nn, 1.0);
}

