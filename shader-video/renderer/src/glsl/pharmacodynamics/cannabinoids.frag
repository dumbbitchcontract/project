float angleOf(vec2 xy) {
	float angle = atan(xy.y / xy.x);
	// Edge case
	if (xy.x == 0.) {
		if (xy.y > 0.) return PI / 2.;
		else if (xy.y < 0.) return 3.*PI/2.;
		else return 0.;
	}
	// Edge case
	else if (xy.y == 0.) {
		if (xy.y >= 0.) return 0.;
		else return PI;
	}
	// General
	else {
		// Quadrant 3
		if (xy.x < 0. && xy.y < 0.) {
			return PI + angle;
		}
		// Quadrant 2
		else if (xy.x < 0.) {
			return PI + angle;
		}
		// Quadrant 4
		else if (xy.y < 0.) {
			return 3.*PI/2. + (PI/2. + angle);
		}
		// Quadrant 1
		else {
			return angle;
		}
	}
}



vec4 cannabinoids(vec2 uv, vec2 resolution, vec3 color, float time, float strength, float seed) {
	uv -= 0.5;
	float angle = angleOf(uv);
	float distance = length(uv);
	float zoom = 0.5 + (0.5+cos(time*2.)*2.0)*5.;
  float lt = pow(length(uv) * 4.0, 2.) - time * 2.0 + seed;
  float i = lt + sin(atan(uv.y, uv.x) * seed * 4.0 + sin(lt * seed * 4.0));
	
	vec3 a = vec3(.5,.5,.25);
	vec3 b = vec3(1.,.0,0.0);
  vec3 c = vec3(0, 1.0, .5);
  vec3 d = vec3(0.0,0.5,0.0);
  
  vec3 pattern = cos(2.5 * (i + a * b)) * c + d;
  
  float brightness = (pattern.r + pattern.g + pattern.b) / 2.0;
  vec3 colorVariation = color * (0.7 + brightness * 1.5);
  
  vec3 complement = mix(color, 1.0 - color, 0.9);
  vec3 col = mix(colorVariation, complement * pattern, 0.25);
  
  return vec4(col, 1.); 
}
