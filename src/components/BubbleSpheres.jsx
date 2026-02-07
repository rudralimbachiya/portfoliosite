import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 40; // More particles for a richer background

export default function BubbleSpheres() {
    const meshRef = useRef();
    const { mouse, viewport } = useThree();

    // Pre-allocate temporary objects to avoid GC during animation
    const tempObject = new THREE.Object3D();
    const tempPos = new THREE.Vector3();
    const tempMousePos = new THREE.Vector3();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < COUNT; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 30, // Wider distribution
                y: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 10,
                speed: 0.05 + Math.random() * 0.15, // Slower, more elegant motion
                scale: 0.1 + Math.random() * 0.4,
                factor: Math.random() * 100,
                orbit: 2 + Math.random() * 5,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                curX: (Math.random() - 0.5) * 30,
                curY: (Math.random() - 0.5) * 20,
                curZ: (Math.random() - 0.5) * 10
            });
        }
        return temp;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const mx = (mouse.x * viewport.width) / 2;
        const my = (mouse.y * viewport.height) / 2;
        tempMousePos.set(mx, my, 0);

        if (!meshRef.current) return;

        particles.forEach((p, i) => {
            const { x, y, z, speed, factor, orbit, scale, rotationSpeed } = p;

            // Floating motion
            const orbitX = Math.sin(t * speed + factor) * orbit;
            const orbitY = Math.cos(t * speed + factor) * orbit;

            let targetX = x + orbitX;
            let targetY = y + orbitY;

            // Repel logic
            tempPos.set(p.curX, p.curY, p.curZ);
            const dist = tempPos.distanceTo(tempMousePos);
            const repelRadius = 8;
            const repelStrength = 4;

            if (dist < repelRadius) {
                const force = (repelRadius - dist) / repelRadius;
                const dirX = (p.curX - mx) / Math.max(0.1, dist);
                const dirY = (p.curY - my) / Math.max(0.1, dist);
                targetX += dirX * force * repelStrength;
                targetY += dirY * force * repelStrength;
            }

            // Smooth interpolation
            p.curX = THREE.MathUtils.lerp(p.curX, targetX, 0.03);
            p.curY = THREE.MathUtils.lerp(p.curY, targetY, 0.03);
            p.curZ = THREE.MathUtils.lerp(p.curZ, z, 0.03);

            // Update instance matrix
            tempObject.position.set(p.curX, p.curY, p.curZ);
            tempObject.scale.setScalar(scale);
            tempObject.rotation.set(t * rotationSpeed * 10, t * rotationSpeed * 15, t * rotationSpeed * 5);
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
            {/* Low-poly icosahedron for that polygonal look */}
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color="#00e5ff"
                emissive="#00e5ff"
                emissiveIntensity={0.8}
                flatShading={true} // Crucial for the polygonal look
                roughness={0}
                metalness={1}
                transparent
                opacity={0.4}
            />
        </instancedMesh>
    );
}
