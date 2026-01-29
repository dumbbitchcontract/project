vec4 anxiolytics(vec2 uv, vec2 resolution, vec3 color, float time, float strength, float seed) {
vec2 u = (uv) - 0.5;
    
    // Adjust aspect ratio if needed
    u.x *= resolution.x / resolution.y;
    
    float a = atan(u.y, u.x);
    float r = length(u);
    float f = (4. + seed) * 2.0;
    float g = 2. * PI / f; 

		float movingR = log(r) - (time * 0.01); 

		vec3 channelOffsets = vec3(0.0, 0.15, 0.3);
		vec3 x;

		x.r = 2. * PI * fract((a + channelOffsets.r) / g);
		x.g = 2. * PI * fract((a + channelOffsets.g) / g);
		x.b = 2. * PI * fract((a + channelOffsets.b) / g);

		x = sin(x) + 1.0;

		x.r = pow(x.r, 0.01);
		x.g = pow(x.g, 0.04);
		x.b = pow(x.b, 0.08);    
   
		float strengthLimit = clamp(strength, 12.0, 30.0);
    vec3 logic = movingR / log(1.0 + x) * strengthLimit;
    
    vec3 phaseShift = vec3(0.0, 1.5, 3.0); 
    vec3 result;

    time *= 0.1;

    result.r = sin(logic.r - time + phaseShift.r);
    result.g = sin(logic.g - time * 2.0 + phaseShift.g);
    result.b = sin(logic.b - time * 3.0 + phaseShift.b);
    
    result = result * 0.4 + 0.5;

    result = mix(result, result * color, 0.6);
    
    return vec4(result, 1.0);
}
