import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Book } from "./Book";

export const Experience = ({ scrollY = 0 }) => {
  const bookRef = useRef();
  const floatRef = useRef();
  const groupRef = useRef();
  const { viewport } = useThree();

  // Animate book based on scroll position
  useFrame((state, delta) => {
    if (floatRef.current && groupRef.current) {
      // Calculate scale based on scroll (book gets smaller as user scrolls down)
      const scrollProgress = Math.min(1, scrollY / (window.innerHeight * 0.7));
      
      // Scale from 1 down to 0.4 as user scrolls
      const targetScale = 1 - (scrollProgress * 0.6);
      
      // Apply scale with smooth easing
      floatRef.current.scale.x = floatRef.current.scale.y = floatRef.current.scale.z = 
        floatRef.current.scale.x + (targetScale - floatRef.current.scale.x) * 0.1;
      
      // Add slight rotation as user scrolls
      const targetRotationY = scrollProgress * 0.8;
      floatRef.current.rotation.y = floatRef.current.rotation.y + 
        (targetRotationY - floatRef.current.rotation.y) * 0.1;
      
      // Move book down as user scrolls
      const targetPositionY = -scrollProgress * 5; // Move down more significantly to make room for search UI
      
      // Move the entire group to the right as user scrolls down
      // Start centered (0) and move right as we scroll
      const targetPositionX = scrollProgress * 2.5; // Move right by 2.5 units when fully scrolled
      
      // Apply position changes with smooth easing
      groupRef.current.position.y = groupRef.current.position.y + 
        (targetPositionY - groupRef.current.position.y) * 0.1;
      groupRef.current.position.x = groupRef.current.position.x + 
        (targetPositionX - groupRef.current.position.x) * 0.1;
      
      // Adjust float animation intensity based on scroll
      // Less floating when zoomed out
      floatRef.current.floatIntensity = 1 - (scrollProgress * 0.8);
    }
  });

  return (
    <>
      {/* Position the group initially at the center */}
      <group ref={groupRef} position={[0, 0, 0]}>
        <Float
          ref={floatRef}
          rotation-x={-Math.PI / 4}
          floatIntensity={1}
          speed={2}
          rotationIntensity={2}
        >
          <Book ref={bookRef} />
        </Float>
      </group>
      <OrbitControls enableZoom={false} enablePan={false} />
      <Environment preset="studio"></Environment>
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
