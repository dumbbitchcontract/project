vec2 pixelate(vec2 uv) {
	float pixelSize = 0.0015;

	vec2 pixelatedCoord = floor(uv / pixelSize) * pixelSize + pixelSize * 0.5;

	return pixelatedCoord;
}
