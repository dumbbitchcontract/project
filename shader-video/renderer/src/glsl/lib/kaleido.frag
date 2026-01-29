vec2 kaleido(float srcAngle, float rotation, float dist) {
	float angle2 = mod(srcAngle * float(SYMMETRY) + rotation, 2.);
	if (angle2 > 1.) angle2 = 2. - angle2;
	angle2 = (angle2 / float(SYMMETRY) * PI);
	vec2 xy = vec2(cos(angle2), sin(angle2)) * dist;

	const int maxReflections = 2;
	int reflections = 0;
	do {
		xy.x = mod(xy.x, 2.);
		if (xy.x > 1.) xy.x = 2. - xy.x;

#if SYMMETRY == 3 //take care of bad triangles for 3-symmetry
		xy.y = mod(xy.y, 2.);
		if (xy.y > 1.) xy.y = 2. - xy.y;
#endif

		if (xy.y > xy.x * tansym)
		{
			float newAngle = atan(xy.y / xy.x) ;
			newAngle = mod(newAngle, symmetry * 2.);
			if (newAngle > symmetry) newAngle = symmetry * 2. - newAngle;
			xy = vec2(cos(newAngle), sin(newAngle)) * length(xy);
		}

	} while (xy.x > 1. && ++reflections < maxReflections);
	return xy;
}
