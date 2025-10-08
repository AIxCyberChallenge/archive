attribute vec3 instanceStart;
attribute vec3 instanceEnd;
attribute float instanceAlpha;
attribute vec3 instanceStartColor;
attribute vec3 instanceEndColor;
attribute float instanceThickness;
attribute float instanceGlow;

varying float vAlpha;
varying vec3 vStartColor;
varying vec3 vEndColor;
varying float vPosition;
varying float vThickness;
varying float vGlow;

void main() {
    vAlpha = instanceAlpha;
    vStartColor = instanceStartColor;
    vEndColor = instanceEndColor;
    vThickness = instanceThickness;
    vGlow = instanceGlow;
    
    // Pass position.x as varying to create gradient along line
    vPosition = position.x;
    
    // Use position.x to determine if this is start or end point
    vec3 worldPos = position.x < 0.5 ? instanceStart : instanceEnd;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
} 