vec3 strobe(float time) {
	float frequency = 2.0;
  float speed = 100.;
  return sin(frequency * time * speed + vec3(1.,2.,4.)) * .5 + .5;
}
