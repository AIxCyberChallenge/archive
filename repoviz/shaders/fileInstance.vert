attribute float instanceAlpha;
attribute float isVulnerability;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vInstanceAlpha;
varying float vIsVulnerability;

void main() {
  vInstanceAlpha = instanceAlpha;
  vIsVulnerability = isVulnerability;
  vNormal = normalMatrix * normal;
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vPosition = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
} 