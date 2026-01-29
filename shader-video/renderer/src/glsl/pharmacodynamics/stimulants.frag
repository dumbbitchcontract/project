#define TAU (PI * 1.0)
float MAX_DIST = 200.0;

// Rotation function for spiral effect
vec2 rotate2D(vec2 p, float angle) {
	float c = cos(angle);
	float s = sin(angle);
	return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

vec2 Scene_GetDistance(vec3 vPos, float spiralAmount, float baseRadius, float largeExtension, float smallExtension, float numPoints, float maxDist) {
	vec2 vResult = vec2(maxDist, 0.0);

	// Apply spiral rotation based on z-depth
	float spiralAngle = vPos.z * spiralAmount;
	vec2 rotatedXY = rotate2D(vPos.xy, spiralAngle);

	// Star-shaped tunnel (using rotated coordinates)
	float angle = atan(rotatedXY.y, rotatedXY.x);
	float r = length(rotatedXY);

	// Star with alternating point sizes
	float a = angle + PI;
	float segmentAngle = (2.0 * PI) / numPoints;

	// Which segment are we in?
	float segment = floor(a / segmentAngle);
	float localAngle = mod(a, segmentAngle);

	// Normalize local angle to -0.5 to 0.5
	float t = (localAngle / segmentAngle) - 0.5;

	// Alternate between large and small points
	float isLargePoint = mod(segment, 4.0);

	float extension = mix(smallExtension, largeExtension, isLargePoint);

	// Moderate sharpness - separated but not too pointed
	float pointShape = exp(-8.0 * abs(t));
	float starRadius = baseRadius + extension * pointShape * 0.4;

	float fTunnelDist = starRadius - r;

	if (fTunnelDist < vResult.x) {
		vResult = vec2(fTunnelDist, a * 80.0 / (PI * 2.0));
	}

	return vResult;
}

vec2 Scene_Trace(vec3 vRayOrigin, vec3 vRayDir, float spiralAmount, float baseRadius, float largeExtension, float smallExtension, float numPoints, float maxDist)
{
	vec2 vResult = vec2(0, 0);
	float t = 0.0;

	for(int i = 0; i < 24; i++)
	{
		float epsilon = 0.001 * t;
		vResult = Scene_GetDistance(vRayOrigin + vRayDir * t, spiralAmount, baseRadius, largeExtension, smallExtension, numPoints, maxDist);

		if(abs(vResult.x) < epsilon || t > maxDist)
			break;

		t += vResult.x;
	}

	vResult.x = t;
	return vResult;
}

vec3 MotionTextureGradient(float f, vec3 baseColor)
{
	// Use base color and its inverted color with HIGH CONTRAST
	vec3 vColA = baseColor;
	vec3 vColB = vec3(1.0) - baseColor * .85; // Inverted color

	// Sharp transition for high contrast
	float fCol = step(1.2, fract(f));

	// More aggressive brightness modulation
	float fLum = sin(f * TAU) * 0.5 + 0.65;
	fLum = pow(fLum, 1.2); // Increase contrast

	return mix(vColA, vColB, fCol) * mix(2.5, 0.5, fLum);
}

vec3 MotionTexture(vec2 vUV, vec3 baseColor)
{
	float x = fract(vUV.x);
	float fOffset = floor(x * 2.0) / 2.0;
	float y = fract(vUV.y + fOffset);

	return MotionTextureGradient(y, baseColor);
}

vec3 GetCameraRayDir(const in vec2 vWindow, const in vec3 vCameraPos, const in vec3 vCameraTarget)
{
	vec3 vForward = normalize(vCameraTarget - vCameraPos);
	vec3 vRight = normalize(cross(vec3(0.0, 1.0, 0.0), vForward));
	vec3 vUp = normalize(cross(vForward, vRight));

	float fPersp = 3.0;
	vec3 vDir = normalize(vWindow.x * vRight + vWindow.y * vUp + vForward * fPersp);
	return vDir;
}

vec3 paint(vec2 uvz, float animTime, float spiralAmount, vec3 baseColor, float baseRadius, float largeExtension, float smallExtension, float numPoints, float strength, float maxDist) {
	vec3 vCameraPos = vec3(0.0, 0.0, 0.0);
	vec3 vCameraTarget = vec3(0., 0., 10.0);

	vec3 vRayOrigin = vCameraPos;
	vec3 vRayDir = GetCameraRayDir(uvz, vCameraPos, vCameraTarget);

	vec2 vScene = Scene_Trace(vRayOrigin, vRayDir, spiralAmount, baseRadius, largeExtension, smallExtension, numPoints, maxDist);
	float fDist = vScene.x;
	vec3 vPos = vRayOrigin + vRayDir * fDist;

	// Texture mapping
	vec2 texUV = vScene.yx * vec2(0.1, 0.05);

	// Animate using pre-warped time
	texUV.y += animTime;

	// Far away = black
	if (fDist > maxDist) {
	  texUV = vec2(0);
	}

	vec3 color = MotionTexture(texUV + .5, baseColor);
	color = color * 1.75;

	// Distance fog (strength determines fog density, range ~0-10)
	float t = fDist * fDist;
	float normalizedStrength = clamp(strength / 10.0, 0.0, 1.0);
	float fogAmount = mix(0.0005, 0.0003, normalizedStrength);
	float fFog = 1.0 - exp2(-t * fogAmount);
	color = mix(color, vec3(0.0), fFog);

	color = sqrt(color);

	return color;
}

vec4 stimulants(vec2 uv, vec2 resolution, vec3 color, float time, float strength, float seed) {
    vec2 uvz = uv * 2. - 1.;
    uvz.x *= resolution.x/resolution.y;
    //case 'methamphetamine':
    //  return 1;
    //case 'amphetamine':
    //  return 2;
    //case '2-fma':
    //  return 3;
    //case '4-fma':
    //  return 4;
    //case 'lisdexamfetamine':
    //  return 5;
    //case 'dextroamphetamine':
    //  return 6;
    //case 'caffeine':
    //  return 7;
    //case 'cocaine':
    //  return 8;

	float spiralAmount = 0.009;
	float baseRadius = 22.;
	float largeExtension = 2.0;
	float smallExtension = 4.0;
	float numPoints = 110.;
  if (seed == 2.0) {
  spiralAmount = 0.009;
	baseRadius = 6.;
	largeExtension = 4.0;
	smallExtension = 4.0;
	numPoints = 32.;
	} else if (seed == 3.0) {
	spiralAmount = 0.005;
	baseRadius = 8.;
	largeExtension = 2.0;
	smallExtension = 4.0;
	numPoints = 32.;
    } else if (seed == 4.0) {
	spiralAmount = 0.002;
	baseRadius = 8.;
	largeExtension = 4.0;
	smallExtension = 8.0;
	numPoints = 64.;
    } else if (seed == 5.0) {
  spiralAmount = 0.02;
  baseRadius = 10.0;
	largeExtension = 3.0;
	smallExtension = 6.0;
	numPoints = 64.;
	    } else if (seed == 6.0) {
  spiralAmount = 0.01;
  baseRadius = 10.0;
	largeExtension = 4.0;
	smallExtension = 2.0;
	numPoints = 64.;
    } else if (seed == 7.0) {
	spiralAmount = 0.000;
	baseRadius = 10.;
	largeExtension = 0.5;
	smallExtension = 0.5; numPoints = 24.;
		} else if (seed == 8.0) {
					spiralAmount = 0.001;
					baseRadius = 5.;
					largeExtension = 10.0;
					smallExtension = 10.0;
					numPoints = 64.;
    }

    float baseSpeed = max(min(20., 1.0 + strength * 10.), 50.0);

    float animTime = baseSpeed * time;

    vec3 col = paint(uvz, animTime, spiralAmount, color, baseRadius, largeExtension, smallExtension, numPoints, strength, 550.);

    return vec4(col, 1.0);
}

