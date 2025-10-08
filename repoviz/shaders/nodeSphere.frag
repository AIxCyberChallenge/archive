varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

uniform vec3 uColor;
uniform float uMetalness;
uniform float uRoughness;
uniform float uGlow;
uniform float uTime;

// Function to calculate fresnel effect
float fresnel(vec3 viewDirection, vec3 normal, float power) {
    return pow(1.0 - clamp(dot(viewDirection, normal), 0.0, 1.0), power);
}

void main() {
    // Normalize directions
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    
    // Calculate base color
    vec3 color = uColor;
    
    // Calculate fresnel effect for edge glow
    float fresnelTerm = fresnel(viewDir, normal, 4.0);
    
    // Add some subtle animation to the fresnel effect based on time
    float animatedFresnel = fresnelTerm * (1.0 + 0.2 * sin(uTime * 0.5));
    
    // Add rim lighting with fresnel
    vec3 rimLight = vec3(1.0, 1.0, 1.0) * animatedFresnel * 0.6;
    
    // Add specular highlight
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfVector = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfVector), 0.0), 32.0 / uRoughness);
    
    // Adjust specular based on metalness
    vec3 specularColor = mix(vec3(1.0), uColor, uMetalness) * specular * (1.0 - uRoughness);
    
    // Create a soft pattern based on position to add visual interest
    float pattern = 0.97 + 0.03 * sin(vPosition.x * 10.0 + uTime * 0.2) * sin(vPosition.y * 10.0) * sin(vPosition.z * 10.0);
    
    // Combine all lighting effects
    vec3 finalColor = color * pattern + rimLight + specularColor;
    
    // Add glow effect when highlighted
    if (uGlow > 0.0) {
        float glowPulse = 0.8 + 0.2 * sin(uTime * 3.0);
        finalColor += uColor * uGlow * glowPulse * 0.5;
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
} 