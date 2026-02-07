import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function NeuralSphere() {
    const meshRef = useRef();
    const materialRef = useRef();

    // Create a sphere with many vertices for deformation
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 15), []);

    useFrame((state) => {
        const { clock, mouse } = state;
        if (meshRef.current) {
            // Rotate the sphere
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;

            // Pulse effect based on mouse
            const targetScale = 1 + Math.abs(mouse.x * mouse.y) * 0.5;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            // Update shader uniforms for "wobble"
            if (materialRef.current) {
                materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
                materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y);
            }
        }
    });

    const shaderArgs = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uColor: { value: new THREE.Color('#00e5ff') }
        },
        vertexShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;
      varying float vDistortion;

      void main() {
        vUv = uv;
        
        vec3 pos = position;
        float distortion = sin(pos.x * 2.0 + uTime) * cos(pos.y * 2.0 + uTime) * 0.15;
        
        // Push away from mouse (simulated)
        float d = distance(uMouse, vec2(pos.x, pos.y) * 0.2);
        distortion += (1.0 - smoothstep(0.0, 1.5, d)) * 0.2;
        
        pos += normal * distortion;
        vDistortion = distortion;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
        fragmentShader: `
      uniform vec3 uColor;
      varying float vDistortion;
      
      void main() {
        float intensity = 0.3 + vDistortion * 2.5;
        gl_FragColor = vec4(uColor * intensity, 1.0);
      }
    `,
        wireframe: true,
    }), []);

    return (
        <mesh ref={meshRef}>
            <primitive object={geometry} attach="geometry" />
            <shaderMaterial
                ref={materialRef}
                args={[shaderArgs]}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
}
