vec4 cocaine(vec2 uv, vec2 resolution, vec3 color, float time, float strength, float seed) {
	//uv = uv * resolution;

	//vec2 center = vec2(resolution.x/2.0, resolution.y/2.0);
	//vec2 xy = vec2((uv.x-center.x), (uv.y-center.y));
	//float x = xy.x;
	//float y = xy.y;

	//float zr = time * 1. + 300.0/sqrt(x*x+y*y);
	//float zt = mod(3.1415*2.0+0.5*atan(y,x), 3.141*1.0);

	//float czk1 = 1.0/PI;
	//float czk2 = (20.0/PI) * (5.0);

	//zt = floor(zt*czk2)/czk2;

	//float parx = 0.5 + 0.5*cos(zt*16.0+zr);
	//float pary = 0.5 + 0.5*cos(zt*16.0+zr*16.0);

	////parx = mod(1.5+(zr*6.0+zt), 6.0)/6.0;
	//pary = mod((zt+zt), 3.141)/3.141;

	////parx = mod(zt*12.0+zr*6.0, PI*2.0)/PI/2.0;
	////pary = mod(zt*6.0+zr, PI*2.0)/PI/2.0;

	//vec3 col = vec3(min(parx * color.r * 0.1, pary) * 1.5, parx * color.g * 0.1, max(parx, pary * color.b * 0.1));

	//return vec4(col, 1.0);

	uv = uv * resolution;

	vec2 center = vec2(resolution.x/2.0, resolution.y/2.0);
	vec2 xy = vec2((uv.x-center.x), (uv.y-center.y));
	float x = xy.x;
	float y = xy.y;

	float zr = time * 1. + 500.0/sqrt(x*x+y*y);
	float zt = mod(3.1415*2.0+0.5*atan(y,x), 3.141*2.0);

	float czk1 = 1.0/PI;
	float czk2 = (50.0/PI) * (1.0);

	zt = floor(zt*czk2)/czk2;

	float parx = 0.5 + 5.5*cos(zt*16.0+zr);
	float pary = 0.5 + 5.5*cos(zt*16.0+zr*16.0);

	//parx = mod(1.5+(zr*6.0+zt), 6.0)/6.0;
	//pary = mod((zt+zt), 3.141)/3.141;

	//parx = mod(zt*12.0+zr*6.0, PI*2.0)/PI/2.0;
	//pary = mod(zt*6.0+zr, PI*2.0)/PI/2.0;

	vec3 col = vec3(
		min(parx * 0.1, pary) * 1.5,
		parx * 0.1,
		max(parx, pary * 0.1)
	);

	return vec4(mix(col, color, pary * 0.1), 1.0);
}
