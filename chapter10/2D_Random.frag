// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (vec2 st) {
    // return fract(sin(dot(st.xy,
    //                      vec2(12.9898,78.233)))*
    //     43758.5453123);
        // return fract(sin(dot(st.xy,
        //                  vec2(12.9898,78.233)))*
        // 43758.5453123+u_time);
        //         return fract(sin(dot(st.xy+u_time,
        //                  vec2(12.9898,78.233)))*
        // 43758.5453123);
        // return fract(sin(dot(st.xy,
        //                  vec2(12.9898,78.233)*u_time))*
        // 43758.5453123);
        // return fract(sin(dot(st.xy,
        //                  vec2(12.9898,78.233)+u_time)+u_time)*
        // 43758.5453123);
        return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)*u_time))*
        43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // float rnd = random( st );
    // float rnd = random( st / u_mouse);
    float rnd = random( st + u_mouse);

    gl_FragColor = vec4(vec3(rnd),1.0);
}
