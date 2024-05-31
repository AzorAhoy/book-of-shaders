// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    vec2 pos = vec2(0.5)-st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);
    // a += mod(u_time, TWO_PI);

    float f = cos(a*3.);
    // f = abs(cos(a*3.));
    // f = abs(cos(a*2.5))*.5+.3;
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1;
    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;
    f = abs(cos(a*12.0) * sin(a* (1.+sin(u_time)) *3.0)) * 0.8 + 0.1;


    color = vec3( 1.-smoothstep(f,f+0.02,r) );
    // Set the output color to a mix of black and a color between red and yellow
    // depending on the magnitude of the radius.
    color = mix(vec3(0.0), 
                vec3(1.0, 1.0-0.7*r, 1.0-2.0*r),
                color);

    gl_FragColor = vec4(color, 1.0);
}
