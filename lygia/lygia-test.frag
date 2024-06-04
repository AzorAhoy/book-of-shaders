/*
    This shader was composed using the following elements from LYGIA Shader library ( https://lygia.xyz )

        * lygia/draw/fill.glsl
        * lygia/space/aspect.glsl
        * lygia/space/ratio.glsl
        * lygia/space/center.glsl
        * lygia/space/uncenter.glsl
        * lygia/space/rotate.glsl
        * lygia/sdf/circleSDF.glsl
        * lygia/sdf/crossSDF.glsl
        * lygia/sdf/flowerSDF.glsl
        * lygia/sdf/gearSDF.glsl
        * lygia/sdf/heartSDF.glsl
        * lygia/sdf/hexSDF.glsl
        * lygia/sdf/polySDF.glsl
        * lygia/sdf/rectSDF.glsl
        * lygia/sdf/raysSDF.glsl
        * lygia/sdf/spiralSDF.glsl
        * lygia/sdf/starSDF.glsl
        * lygia/sdf/triSDF.glsl
        * lygia/sdf/vesicaSDF.glsl
        * lygia/sdf/rhombSDF.glsl

    LYGIA is dual-licensed under the [Prosperity License](https://prosperitylicense.com/versions/3.0.0) 
    and the [Patron License](https://lygia.xyz/license) for [sponsors](https://github.com/sponsors/patriciogonzalezvivo) 
    and [contributors](https://github.com/patriciogonzalezvivo/lygia/graphs/contributors).

    Those are automatically added to the [Patron License](https://lygia.xyz/license) and they (only they) 
    can ignore and any non-commercial rule of the [Prosperity License](https://prosperitylicense.com/versions/3.0.0)
    software (please take a look at the exceptions).

    It's also possible to get a permanent commercial license hooked to a single and specific version of LYGIA.
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2        u_resolution;
uniform vec2        u_mouse;
uniform float       u_time;

// By default all 2D shapes and space functions asume
// the center is at vec2(0.5, 0.5), this can be overloaded
// by defining CENTER_2D to be something else, like vec2(0.0)
// before the functions are include

// #define CENTER_2D vec2(0.0)

#ifndef FNC_AASTEP
#define FNC_AASTEP
#if defined(GL_OES_standard_derivatives)
#extension GL_OES_standard_derivatives : enable
#endif
float aastep(float threshold, float value) {
#if !defined(GL_ES) || __VERSION__ >= 300 || defined(GL_OES_standard_derivatives)
    float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
#elif defined(AA_EDGE)
    float afwidth = AA_EDGE;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
#else 
    return step(threshold, value);
#endif
}
#endif
#ifndef FNC_FILL
#define FNC_FILL
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float fill(float x, float size) {
    return 1.0 - aastep(size, x);
}
#endif

#ifndef FNC_ASPECT
#define FNC_ASPECT
vec2 aspect(vec2 st, vec2 s) {
    st.x = st.x * (s.x / s.y);
    return st;
}
#endif
#ifndef FNC_RATIO
#define FNC_RATIO
vec2 ratio(in vec2 v, in vec2 s) {
    return mix( vec2((v.x*s.x/s.y)-(s.x*.5-s.y*.5)/s.y,v.y),
                vec2(v.x,v.y*(s.y/s.x)-(s.y*.5-s.x*.5)/s.x),
                step(s.x,s.y));
}
#endif

#ifndef FNC_CENTER
#define FNC_CENTER
float center(float x) { return x * 2.0 - 1.0; }
vec2  center(vec2 v) { return v * 2.0 - 1.0; }
vec3  center(vec3 v) { return v * 2.0 - 1.0; }
#endif
#ifndef FNC_UNCENTER
#define FNC_UNCENTER
float uncenter(float v) { return v * 0.5 + 0.5; }
vec2  uncenter(vec2 v) { return v * 0.5 + 0.5; }
vec3  uncenter(vec3 v) { return v * 0.5 + 0.5; }
#endif
#ifndef FNC_ROTATE2D
#define FNC_ROTATE2D
mat2 rotate2d(const in float r){
    float c = cos(r);
    float s = sin(r);
    return mat2(c, -s, s, c);
}
#endif

#ifndef FNC_ROTATE4D
#define FNC_ROTATE4D
mat4 rotate4d(in vec3 a, const in float r) {
    a = normalize(a);
    float s = sin(r);
    float c = cos(r);
    float oc = 1.0 - c;
    return mat4(oc * a.x * a.x + c,         oc * a.x * a.y - a.z * s,   oc * a.z * a.x + a.y * s,   0.0,
                oc * a.x * a.y + a.z * s,   oc * a.y * a.y + c,         oc * a.y * a.z - a.x * s,   0.0,
                oc * a.z * a.x - a.y * s,   oc * a.y * a.z + a.x * s,   oc * a.z * a.z + c,         0.0,
                0.0,                        0.0,                        0.0,                        1.0);
}
#endif

#ifndef FNC_ROTATE
#define FNC_ROTATE
vec2 rotate(in vec2 v, in float r, in vec2 c) {
    return rotate2d(r) * (v - c) + c;
}
vec2 rotate(in vec2 v, in float r) {
    #ifdef CENTER_2D
    return rotate(v, r, CENTER_2D);
    #else
    return rotate(v, r, vec2(.5));
    #endif
}
vec2 rotate(vec2 v, vec2 x_axis) {
    #ifdef CENTER_2D
    v -= CENTER_2D;
    #endif
    vec2 rta = vec2( dot(v, vec2(-x_axis.y, x_axis.x)), dot(v, x_axis) );
    #ifdef CENTER_2D
    rta += CENTER_2D;
    #endif
    return rta;
}
vec3 rotate(in vec3 v, in float r, in vec3 axis, in vec3 c) {
    return (rotate4d(axis, r) * vec4(v - c, 1.)).xyz + c;
}
vec3 rotate(in vec3 v, in float r, in vec3 axis) {
    #ifdef CENTER_3D
    return rotate(v, r, axis, CENTER_3D);
    #else
    return rotate(v, r, axis, vec3(0.));
    #endif
}
vec4 rotate(in vec4 v, in float r, in vec3 axis, in vec4 c) {
    return rotate4d(axis, r) * (v - c) + c;
}
vec4 rotate(in vec4 v, in float r, in vec3 axis) {
    #ifdef CENTER_4D
    return rotate(v, r, axis, CENTER_4D);
    #else
    return rotate(v, r, axis, vec4(0.));
    #endif
}
#if defined(FNC_QUATMULT)
vec3 rotate(QUAT q, vec3 v) {
    QUAT q_c = QUAT(-q.x, -q.y, -q.z, q.w);
    return quatMul(q, quatMul(vec4(v, 0), q_c)).xyz;
}
vec3 rotate(QUAT q, vec3 v, vec3 c) {
    vec3 dir = v - c;
    return c + rotate(q, dir);
}
#endif
#endif


#ifndef CIRCLESDF_FNC
#define CIRCLESDF_FNC(POS_UV) length(POS_UV)
#endif
#ifndef FNC_CIRCLESDF
#define FNC_CIRCLESDF
float circleSDF(in vec2 v) {
#ifdef CENTER_2D
    v -= CENTER_2D;
#else
    v -= 0.5;
#endif
    return CIRCLESDF_FNC(v) * 2.0;
}
#endif

#ifndef FNC_RECTSDF
#define FNC_RECTSDF
float rectSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;   
}
float rectSDF(vec2 p, float b, float r) {
    return rectSDF(p, vec2(b), r);
}
float rectSDF(in vec2 st, in vec2 s) {
    #ifdef CENTER_2D
        st -= CENTER_2D;
        st *= 2.0;
    #else
        st = st * 2.0 - 1.0;
    #endif
    return max( abs(st.x / s.x),
                abs(st.y / s.y) );
}
float rectSDF(in vec2 st, in float s) {
    return rectSDF(st, vec2(s) );
}
float rectSDF(in vec2 st) {
    return rectSDF(st, vec2(1.0));
}
#endif

#ifndef FNC_CROSSSDF
#define FNC_CROSSSDF
float crossSDF(in vec2 st, in float s) {
    vec2 size = vec2(.25, s);
    return min(rectSDF(st.xy, size.xy),
               rectSDF(st.xy, size.yx));
}
#endif

#ifndef FNC_FLOWERSDF
#define FNC_FLOWERSDF
float flowerSDF(vec2 st, int N) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    st *= 4.0;
    float r = length(st) * 2.0;
    float a = atan(st.y, st.x);
    float v = float(N) * 0.5;
    return 1.0 - (abs(cos(a * v)) *  0.5 + 0.5) / r;
}
#endif
#ifndef FNC_MAP
#define FNC_MAP
float map(float v, float iMin, float iMax ) { return (v-iMin)/(iMax-iMin); }
vec2 map(vec2 v, vec2 iMin, vec2 iMax ) { return (v-iMin)/(iMax-iMin); }
vec3 map(vec3 v, vec3 iMin, vec3 iMax ) { return (v-iMin)/(iMax-iMin); }
vec4 map(vec4 v, vec4 iMin, vec4 iMax ) { return (v-iMin)/(iMax-iMin); }
float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec2 map(in vec2 v, in vec2 iMin, in vec2 iMax, in vec2 oMin, in vec2 oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec3 map(in vec3 v, in vec3 iMin, in vec3 iMax, in vec3 oMin, in vec3 oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec4 map(in vec4 v, in vec4 iMin, in vec4 iMax, in vec4 oMin, in vec4 oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
#endif

#ifndef FNC_GEARSDF
#define FNC_GEARSDF
float gearSDF( vec2 st, float b, int N) {
    const float e = 2.71828182845904523536;
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    st *= 3.0;
    float s = map(b, 1.0, 15.0, 0.066, 0.5);
    float d = length(st) - s;
    float omega = b * sin(float(N) * atan(st.y, st.x));
    float l = pow(e, 2.0 * omega);
    float hyperTan = (l - 1.0) / (l + 1.0);
    float r = (1.0/b) * hyperTan;
    return (d + min(d, r));
}
#endif
#ifndef FNC_HEARTSDF
#define FNC_HEARTSDF
float heartSDF(vec2 st) {
    #ifdef CENTER_2D
    st -= CENTER_2D;
    #else
    st -= 0.5;
    #endif
    st -= vec2(0.0, 0.3);
    float r = length(st) * 5.0;
    st = normalize(st);
    return r - ((st.y * pow(abs(st.x), 0.67)) / (st.y + 1.5) - (2.0) * st.y + 1.26);
}
#endif
#ifndef FNC_HEXSDF
#define FNC_HEXSDF
float hexSDF(in vec2 st) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 2.0;
#else
    st = st * 2.0 - 1.0;
#endif
    st = abs(st);
    return max(abs(st.y), st.x * .866025 + st.y * .5);
}
#endif

#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE
#define GOLDEN_ANGLE 2.39996323
#endif

#ifndef FNC_POLYSDF
#define FNC_POLYSDF
float polySDF(in vec2 st, in int V) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 2.0;
#else
    st = st * 2.0 - 1.0;
#endif
    float a = atan(st.x, st.y) + PI;
    float r = length(st);
    float v = TAU / float(V);
    return cos(floor(.5 + a / v) * v - a ) * r;
}
#endif



#ifndef FNC_RAYSSDF
#define FNC_RAYSSDF
float raysSDF(in vec2 st, in int N) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    return fract(atan(st.y, st.x) / TAU * float(N));
}
#endif

#ifndef FNC_SPIRALSDF
#define FNC_SPIRALSDF
float spiralSDF(vec2 st, float t) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    float r = dot(st, st);
    float a = atan(st.y, st.x);
    return abs(sin(fract(log(r) * t + a * 0.159)));
}
#endif

#ifndef FNC_SCALE
#define FNC_SCALE
vec2 scale(in float st, in float s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in float st, in float s) {
#ifdef CENTER_2D
    return scale(st,  s, CENTER_2D);
#else
    return scale(st,  s, vec2(0.5));
#endif
}
vec2 scale(in vec2 st, in vec2 s, in vec2 center) { return (st - center) * s + center; }
vec2 scale(in vec2 st, in float s, in vec2 center) { return scale(st, vec2(s), center); }
vec2 scale(in vec2 st, in vec2 s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec2 scale(in vec2 st, in float s) {
#ifdef CENTER_2D
    return (st - CENTER_2D) * s + CENTER_2D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec3 scale(in vec3 st, in vec3 s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in float s, in vec3 center) { return (st - center) * s + center; }
vec3 scale(in vec3 st, in vec3 s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec3 scale(in vec3 st, in float s) {
#ifdef CENTER_3D
    return (st - CENTER_3D) * s + CENTER_3D;
#else
    return (st - 0.5) * s + 0.5;
#endif
}
vec4 scale(in vec4 st, float s) { return vec4(scale(st.xy, s), st.zw); }
vec4 scale(in vec4 st, vec2 s) { return vec4(scale(st.xy, s), st.zw); }
#endif

#ifndef FNC_STARSDF
#define FNC_STARSDF
float starSDF(in vec2 st, in int V, in float s) {
#ifdef CENTER_2D
    st -= CENTER_2D;
#else
    st -= 0.5;
#endif
    st *= 2.0;
    float a = atan(st.y, st.x) / TAU;
    float seg = a * float(V);
    a = ((floor(seg) + 0.5) / float(V) +
        mix(s, -s, step(0.5, fract(seg))))
        * TAU;
    return abs(dot(vec2(cos(a), sin(a)),
                   st));
}
float starSDF(in vec2 st, in int V) {
    return starSDF( scale(st, 12.0/float(V)), V, 0.1);
}
#endif

#ifndef FNC_TRISDF
#define FNC_TRISDF
float triSDF(in vec2 st) {
#ifdef CENTER_2D
    st -= CENTER_2D;
    st *= 5.0;
#else
    st -= 0.5;
    st *= 5.0;
#endif
    return max(abs(st.x) * .866025 + st.y * .5, -st.y * 0.5);
}
#endif


#ifndef FNC_VESICASDF
#define FNC_VESICASDF
float vesicaSDF(in vec2 st, in float w) {
    vec2 offset = vec2(w*0.5,0.);
    return max( circleSDF(st-offset),
                circleSDF(st+offset));
}
float vesicaSDF(in vec2 st) {
    return vesicaSDF(st, 0.5);
}
#endif



#ifndef FNC_RHOMBSDF
#define FNC_RHOMBSDF
float rhombSDF(in vec2 st) {
    float offset = 1.0;
    #ifdef CENTER_2D
    offset = CENTER_2D.y * 2.0;
    #endif 
    return max(triSDF(st),
               triSDF(vec2(st.x, offset-st.y)));
}
#endif


void main(void) {
    vec4 color = vec4(vec3(0.0), 1.0);
    vec2 pixel = 1.0/u_resolution.xy;
    vec2 st = gl_FragCoord.xy * pixel;

    // Option 1
    st = ratio(st, u_resolution.xy);

    // // Option 2 
    // st = center(st);
    // st = aspect(st, u_resolution.xy);
    // st = uncenter(st);

    float cols = 4.0; 
    st *= cols;
    vec2 st_i = floor(st);
    vec2 st_f = fract(st);
    // st_f = center(st_f);

    st_f = rotate(st_f, u_time * 0.4);

    float sdf = 0.0;
    float index = ( st_i.x + (cols-st_i.y - 1.0) * cols);
    
    if (index == 0.0)
        sdf = circleSDF( st_f );
    else if (index == 1.0)
        sdf = vesicaSDF( st_f, 0.25 );
    else if (index == 2.0)
        sdf = rhombSDF(st_f);
    else if (index == 3.0)
        sdf = triSDF( st_f );
    else if (index == 4.0)
        sdf = rectSDF( st_f, vec2(1.0) );
    else if (index == 5.0)
        sdf = polySDF( st_f, 5);
    else if (index == 6.0)
        sdf = hexSDF( st_f );
    else if (index == 7.0)
        sdf = starSDF(st_f, 5);
    else if (index == 8.0)
        sdf = flowerSDF(st_f, 5);
    else if (index == 9.0)
        sdf = crossSDF(st_f, 1.0);
    else if (index == 10.0)
        sdf = gearSDF(st_f, 10.0, 10);
    else if (index == 11.0)
        sdf = heartSDF(st_f);
    else if (index == 12.0)
        sdf = raysSDF(st_f, 14);
    else if (index == 13.0)
        sdf = spiralSDF(st_f, 0.1);
    else
        sdf = 1.0;

    color.rgb += fill(sdf, 0.5);
    
    gl_FragColor = color;
}
