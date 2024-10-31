/** 
 * @file shaders/index.ts
 * @description Custom WebGL shaders for particle rendering with size attenuation and smooth circular particles
 */

/**
 * Vertex shader responsible for particle positioning and size calculations
 * - Handles dynamic particle sizing based on distance from camera
 * - Passes color data to fragment shader
 */
export const vertexShader = `
    // Input attribute for controlling individual particle sizes
    attribute float size;
    
    // Pass color to fragment shader
    varying vec3 vColor;
    
    void main() {
        // Pass vertex color to fragment shader
        vColor = color;
        
        // Transform vertex position to view space
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // Calculate size attenuation based on distance from camera
        // Particles appear smaller as they get further away
        // 300.0 is a scaling factor - adjust for desired distance falloff
        gl_PointSize = size * (300.0 / -mvPosition.z);
        
        // Final clip space position
        gl_Position = projectionMatrix * mvPosition;
    }
`;

/**
 * Fragment shader responsible for rendering individual particles
 * - Creates smooth circular particles using alpha falloff
 * - Discards pixels outside particle boundary for proper transparency
 */
export const fragmentShader = `
    // Receive interpolated color from vertex shader
    varying vec3 vColor;
    
    void main() {
        // Convert UV coordinates to center-oriented space (-0.5 to 0.5)
        vec2 center = gl_PointCoord - vec2(0.5, 0.5);
        
        // Calculate distance from center
        float dist = length(center);
        
        // Smooth alpha falloff between radius 0.45 and 0.5
        // Creates soft particle edges
        float alpha = smoothstep(0.5, 0.45, dist);
        
        // Discard nearly transparent pixels for better performance
        if (alpha < 0.1) discard;
        
        // Output final color with calculated alpha
        gl_FragColor = vec4(vColor, alpha);
    }
`;