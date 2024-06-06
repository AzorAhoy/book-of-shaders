// Source: http://thornebrandt.com/blog/bookofshaders_index
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform vec2 u_resolution;
uniform float u_time;

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+0.01,_st);
    uv *= smoothstep(_size,_size+0.01,vec2(1.0)-_st);
    return uv.x*uv.y;
}
    
vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile (vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

float getIndexGrid(vec2 _st, float numCells){
    //y values, big steps.
    float grid = floor(_st.y * numCells) * 1.0/numCells;
    //x values close gap in between y values.
    grid += floor(_st.x * numCells) * 1.0/numCells * 1.0/numCells;
    return grid;
}

float semiCircle(in vec2 _st, float radius){
    float circle = 1.0 - smoothstep(radius, radius+0.001, length(_st));
    return box(_st, vec2(4.0, 1.0)) * circle;
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float numCells = 16.0;
    float index = getIndexGrid(st, numCells);
    st = tile(st,numCells);
    st = rotate2D(st,PI*(index)+(numCells*0.12*u_time));
	st -= 0.5;
    //color can use index to assign unique color to each cell. 
    vec3 color = vec3(1.0 - index, 0.7, 0.2+(index* 0.2));
    gl_FragColor = vec4(vec3(semiCircle(st, 0.5))*color,1.0);
}
