// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define BORDER_WIDTH 0.1

vec3 rectangle(vec2 bottomLeftCorner, vec2 widthAndHeight, vec3 color, vec2 pixel) {
    float leftX = step(bottomLeftCorner.x, pixel.x) - 
                  step(bottomLeftCorner.x+BORDER_WIDTH, pixel.x); // pixel.x
    float leftY = step(bottomLeftCorner.y, pixel.y) - 
                  step(bottomLeftCorner.y+widthAndHeight.t, pixel.y);

    float rightX = step(bottomLeftCorner.x+widthAndHeight.s-BORDER_WIDTH, pixel.x) - 
                   step(bottomLeftCorner.x+widthAndHeight.s, pixel.x);
    float rightY = leftY;

    float bottomX = step(bottomLeftCorner.x+BORDER_WIDTH, pixel.x) - 
                    step(bottomLeftCorner.x+widthAndHeight.s-BORDER_WIDTH, pixel.x);
    float bottomY = step(bottomLeftCorner.y, pixel.y) - 
                    step(bottomLeftCorner.y+BORDER_WIDTH, pixel.y);

    float topX = bottomX;
    float topY = step(bottomLeftCorner.y+widthAndHeight.t-BORDER_WIDTH, pixel.y) - 
                 step(bottomLeftCorner.y+widthAndHeight.t, pixel.y);

    return color * (leftX*leftY + rightX*rightY + topX*topY + bottomX*bottomY);
}

vec3 blurryBorder(float width, vec2 st) {
    // Initialize all RGB color components to 0.0.
    vec3 color = vec3(0.0);

    // Bottom left ┗
    vec2 bl = smoothstep(vec2(0.5*width), vec2(width), st); 
    float c = bl.x * bl.y;
    
    // top-right ┓
    vec2 tr = smoothstep(vec2(0.5*width), vec2(width), 1.0-st); 
    c *= tr.x * tr.y;

    return vec3(c);  
}

vec3 fineBorder1(float width, vec2 st) { // with step()
    // Initialize all RGB color components to 0.0.
    vec3 color = vec3(0.0);

    // Bottom left ┗
    vec2 bl = step(vec2(width),st); 
    float c = bl.x * bl.y;
    
    // top-right ┓
    vec2 tr = step(vec2(width),1.0-st);
    c *= tr.x * tr.y;

    return vec3(c);  
}

vec3 fineBorder2(float width, vec2 st) { // with floor()
    // Initialize all RGB color components to 0.0.
    vec3 color = vec3(0.0);

    // Bottom left ┗
    vec2 bl = floor(vec2(st+(1.0-width)));
    float c = bl.x * bl.y;
    
    // top-right ┓
    vec2 tr = floor(vec2(st-(1.0-width)));
    c *= tr.x * tr.y;

    return vec3(c);  
}

vec3 outline(float width, vec2 st) { // with floor()
    // Initialize all RGB color components to 0.0.
    vec3 color = vec3(1.0);

    float leftX = step(0.0, st.x) - 
                  step(width, st.x); // pixel.x
    float leftY = step(0.0, st.y) - 
                  step(1.0, st.y);

    float rightX = step(1.0-width, st.x) - 
                   step(1.0, st.x);
    float rightY = leftY;

    float bottomX = step(width, st.x) - 
                    step(1.0-width, st.x);
    float bottomY = step(0.0, st.y) - 
                    step(width, st.y);

    float topX = bottomX;
    float topY = step(1.0-width, st.y) - 
                 step(1.0, st.y);

    return color * (leftX*leftY + rightX*rightY + topX*topY + bottomX*bottomY); 
}

// Blurry borders.
void main() {
    // Normalize the (x,y) coords of each pixel.
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    
    // vec3 color = blurryBorder(0.100, st);
    // vec3 color = fineBorder1(0.1, st);
    // vec3 color = fineBorder2(0.1, st);
    vec3 color = outline(0.3, st);
    // vec3 color = rectangle(vec2(0.0, 0.0), 
    //                             vec2(1.0, 1.0), 
    //                             vec3(1.0, 1.0, 1.0),
    //                             st);
    gl_FragColor = vec4(color,1.0);
}