varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;

uniform float uTime;
uniform float uPulse;

void main() {
    // Pass the UV coordinates to the fragment shader
    vUv = uv;
    
    // Calculate normal in world space
    vNormal = normalize(normalMatrix * normal);
    
    // Calculate position in world space
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPosition = worldPosition.xyz;
    
    // Calculate view position
    vec4 modelViewPosition = viewMatrix * worldPosition;
    vViewPosition = -modelViewPosition.xyz;
    
    // Add subtle animation for highlighted nodes (controlled by uPulse)
    vec3 pos = position;
    if (uPulse > 0.0) {
        float pulse = sin(uTime * 3.0) * 0.05 * uPulse;
        pos += normal * pulse;
    }
    
    // Set final position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
} 