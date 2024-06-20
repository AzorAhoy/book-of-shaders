// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    float t = 1.0;
    vec2 pos = vec2(0.0);
    vec2 uv = st;

        // Uncomment to animate
    t = abs(1.0-sin(u_time*.1))*5.;
    uv += noise(uv*2.)*t;
    color += smoothstep(.05,.5, noise(uv*15.));
    uv = rotate2d(PI/2.0) * uv;
    color += smoothstep(.1,.6, noise(uv*10.));
    uv = rotate2d(PI/5.0) * uv;
    color += smoothstep(.1,.8, noise(uv*15.));

    color = smoothstep(0.0, 0.5, color);

    uv = st;
    uv += noise(uv*3.) * t;
    uv = rotate2d(PI/2.0) * uv;
    color += smoothstep(.05,.7, noise(uv*30.));
    uv = rotate2d(PI/5.0) * uv;
    color += smoothstep(.1,.95, noise(uv*30.));

    uv = st;
    uv += noise(st*4.) * t;
    uv = rotate2d(PI/2.0) * uv;
    color += smoothstep(.05,.7, noise(uv*30.));
    uv = rotate2d(PI/5.0) * uv;
    color += smoothstep(.1,.65, noise(uv*50.));

    gl_FragColor = vec4(1.-color,1.0);
}