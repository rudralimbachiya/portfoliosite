import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import BubbleSpheres from './BubbleSpheres';

function MouseLight() {
  const lightRef = useRef();
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      lightRef.current.position.set(x, y, 2);
    }
  });

  return <pointLight ref={lightRef} intensity={2} color="#00e5ff" distance={10} />;
}

function ParticleBackground() {
  const points = useRef();
  const { mouse } = useThree();

  const count = 4000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0001;
      const targetRotationY = mouse.x * 0.05;
      const targetRotationX = -mouse.y * 0.05;
      points.current.rotation.y = THREE.MathUtils.lerp(points.current.rotation.y, targetRotationY, 0.05);
      points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, targetRotationX, 0.05);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#00e5ff" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

export default function Scene() {
  return (
    <div className="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#0a0a0a'), 1);
        }}
      >
        <ambientLight intensity={0.4} />
        <MouseLight />
        <Environment preset="night" />
        <ParticleBackground />
        <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
          <BubbleSpheres />
        </Float>
      </Canvas>
    </div>
  );
}
