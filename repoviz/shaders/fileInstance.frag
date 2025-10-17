uniform vec3 uColor;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vInstanceAlpha;

void main() {
  // Skip rendering completely if alpha is zero (fully transparent)
  if (vInstanceAlpha <= 0.001) {
    discard;
    return;
  }
  
  // DISABLED - Pulsing effect causes flickering on large repos due to GPU overload
  // float pulse = (sin(uTime * 2.0 + length(vPosition) * 0.1) * 0.2 + 0.8);
  // vec3 baseColor = uColor * pulse;
  
  // Static color without animation to prevent GPU overload on large repositories
  vec3 baseColor = uColor;
  
  // Basic lighting
  vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = max(dot(normalize(vNormal), lightDirection), 0.2);
  
  gl_FragColor = vec4(baseColor * diffuse, vInstanceAlpha);
} 