"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";

function CardMesh({ textureId, hovered }: { textureId: string, hovered: boolean }) {
  // Load the card geometry from local public folder
  const { nodes } = useGLTF("/card.glb") as any;
  
  // Mapping ID -> Hex Color
  const colorMap: Record<string, string> = {
    neon: "#00ffff",
    pirate: "#ffcc00",
    retro: "#ff00ff",
    girl: "#ff66b2",
    beta: "#9932cc",
    pharaoh: "#b8860b",
    classic: "#ffffff"
  };
  
  const cardColor = colorMap[textureId] || "#ffffff";

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation de base
      meshRef.current.rotation.y += delta * (hovered ? 2.5 : 0.5);
      
      // Léger mouvement de flottaison
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Scale down the vercel card model slightly so it fits in the box
  return (
    <mesh 
      ref={meshRef} 
      geometry={nodes.card.geometry} 
      scale={[0.8, 0.8, 0.8]}
      rotation={[0, Math.PI, 0]}
    >
      <meshStandardMaterial color={cardColor} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

export default function Card3D({ textureId }: { textureId: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="w-full h-full cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, 5]} intensity={1} color="#00f0ff" />
        <directionalLight position={[5, -5, 5]} intensity={1} color="#bc13fe" />
        <Environment preset="city" />
        
        <CardMesh textureId={textureId} hovered={hovered} />
      </Canvas>
    </div>
  );
}
