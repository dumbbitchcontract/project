#define f(v) sin( max(4.0, min(42., strength * 20.)) *(v) )
#define S(v) smoothstep( -1., 1., ( f(v) -.4 ) / fwidth(f(v)) )
vec4 nootropics(vec2 uv, vec2 resolution, vec3 color, float time, float strength, float seed) {
	vec2 R = uv.xy;
	vec2 U = (uv - 0.5); 
	float l = length(U);
	float a = atan(U.y, U.x);
	float s1 = S(a - l);
	float s2 = S(a + l - min(0.25, 1.0 + strength) * time);
	
	float pattern = max(s1, s2);
	vec3 invertedColor = vec3(1.0) - color;
	vec3 finalColor = mix(color, vec3(0.0), pattern);

	return vec4(finalColor, 1.0);
}

