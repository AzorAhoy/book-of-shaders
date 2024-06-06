// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
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

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    float numCells = 16.0;
    // st *= 3.;      // Scale up the space by 3
    // st = fract(st); // Wrap around 1.0
    float index = getIndexGrid(st, numCells);
    st = tile(st, numCells);
    // Now we have 9 spaces that go from 0-1

    color = vec3(st,0.0);
    color = vec3(circle(st,0.5));

	gl_FragColor = vec4(color,1.0);
}
