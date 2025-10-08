varying float vAlpha;
varying vec3 vStartColor;
varying vec3 vEndColor;
varying float vPosition;
varying float vThickness;
varying float vGlow;

void main() {
    // Create gradient from dimmed white to child node color
    // Use vPosition to create a gradient along the line length
    // vPosition goes from 0 to 1 along the line
    float t = vPosition;
    vec3 gradientColor = mix(vStartColor, vEndColor, t);
    
    // Apply thickness-based alpha boost for diff lines
    float thicknessMultiplier = vThickness > 1.0 ? 2.0 : 1.0; // Increased multiplier
    float finalAlpha = vAlpha * thicknessMultiplier;
    
    // Apply glow effect
    if (vGlow > 0.0) {
        // Create a stronger simulated glow by brightening the color and adding more bloom
        vec3 glowColor = gradientColor * (1.0 + vGlow * 1.0); // Increased brightness
        float glowAlpha = finalAlpha * (1.0 + vGlow * 0.8); // Increased alpha boost
        
        // Blend the glow with the base color more aggressively
        vec3 finalColor = mix(gradientColor, glowColor, vGlow * 0.8); // Increased blend
        float finalGlowAlpha = mix(finalAlpha, glowAlpha, vGlow * 0.7); // Increased alpha blend
        
        gl_FragColor = vec4(finalColor, finalGlowAlpha);
    } else {
        gl_FragColor = vec4(gradientColor, finalAlpha);
    }
} 