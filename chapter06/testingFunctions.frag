// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

// Convert HSB to RGB.
//
//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float circularEaseOut (float h) {
    return sqrt(1. - pow(1. - h, 2.0));
}
float quaImpulse(float k, float x) {
    return 2.0*sqrt(k)*x/(1.0+k*x*x);
}
void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;

    // float y = circularEaseOut(st.x);
    float y = quaImpulse(3.0, st.x);

    vec3 color = vec3(y);


    // color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
    color = hsb2rgb(vec3(y, 1.0, 1.0));
        // Plot a line
    float pct = plot(st,y);
	color = (1.0-pct)*color+pct*vec3(1.0,1.0,1.0);
	gl_FragColor = vec4(color,1.0);
}