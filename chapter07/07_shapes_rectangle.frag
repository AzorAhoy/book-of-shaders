// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

#define BORDER_WIDTH 0.01

vec3 rectangle(vec2 bottomLeftCorner, vec2 widthAndHeight, vec3 color, vec2 pixel) {
    float leftX = step(bottomLeftCorner.x, pixel.x) - 
                  step(bottomLeftCorner.x+BORDER_WIDTH, pixel.x);
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

void main() {
    // Normalize the (x,y) coords of each pixel.
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec3 orangeRect = rectangle(vec2(0.2, 0.4), 
                                vec2(0.6, 0.5), 
                                vec3(1.0, 0.5, 0.0),
                                st);    
    vec3 greenRect = rectangle(vec2(0.3, 0.2), 
                               vec2(0.6, 0.4), 
                               vec3(0.0, 1.0, 0.0),
                               st);
    vec3 purpleRect = rectangle(vec2(0.1, 0.1), 
                                vec2(0.5, 0.6), 
                                vec3(0.5, 0.0, 1.0),
                                st);
    vec3 whiteRect = rectangle(vec2(0.0, 0.0), 
                                vec2(1.0, 1.0), 
                                vec3(1.0, 1.0, 1.0),
                                st);
    gl_FragColor = vec4(orangeRect+greenRect+purpleRect+whiteRect, 1.0);
}