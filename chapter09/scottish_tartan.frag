#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

#define PI 3.14159265358979323846

float bar(float min, float max, float x)
{
	return step(min, x) * step(x, max);
}

vec2 tile(vec2 uv, float div)
{
	return fract(uv * div);
}

vec3 combine(vec2 uv, float div, vec3 color1, vec3 color2, float t)
{
	uv = tile(uv, div);
	return
		t >= 1.0 ? color2 :
		t >= 0.5 ? (mod(floor(uv.x * 2.0) + floor(uv.y * 2.0), 2.0) == 0.0 ? color2 : color1) :
		color1;
}

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec3 pattern(vec2 uv)
{
	float mask1 = 0.5 *
		(bar(0.1, 0.2, uv.x) + bar(0.3, 0.4, uv.x)
		+ bar(0.6, 0.7, uv.y) + bar(0.8, 0.9, uv.y)); 
	float mask2 = 0.5 *
		(bar(0.0, 0.1, uv.x) + bar(0.2, 0.3, uv.x) + bar(0.4, 0.5, uv.x)
		+ bar(0.9, 1.0, uv.y) + bar(0.7, 0.8, uv.y) + bar(0.5, 0.6, uv.y));
	float mask3 = 0.5 *
		(bar(0.7, 0.75, uv.x) + bar(0.8, 0.85, uv.x)
		+ bar(0.15, 0.2, uv.y) + bar(0.25, 0.3, uv.y));

	vec3 color = vec3(0.8588, 0.7725, 0.6039);
	color = combine(uv, 50.0, color, vec3(1.0), mask1);
	color = combine(uv, 50.0, color, vec3(0.0), mask2);
	color = combine(uv, 50.0, color, vec3(0.7, 0.2, 0.3), mask3);
	return color;
}

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution;
    uv.x *= u_resolution.x / u_resolution.y;
	uv = rotate2D(uv,PI*0.25);
	vec3 color = pattern(tile(uv, 2.0));

	gl_FragColor = vec4(color,1.0);
}
