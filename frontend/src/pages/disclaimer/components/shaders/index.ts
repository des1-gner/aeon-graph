/**
 * @file shaders/index.ts
 * @description Custom WebGL shaders for particle rendering
 */

export const vertexShader = `
  attribute float size;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  varying vec3 vColor;
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5, 0.5);
    float dist = length(center);
    float alpha = smoothstep(0.5, 0.45, dist);
    if (alpha < 0.1) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`;