import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useAudio } from "../lib/stores/useAudio";

interface StreetObjectProps {
  type: "lamppost" | "tree" | "bench" | "hydrant" | "mailbox";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

const StreetObject = ({ type, position, rotation, scale }: StreetObjectProps) => {
  const objectRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { playHit } = useAudio();
  
  // Create a unique animation offset for this object
  const animationOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  // Interaction handlers
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  const handleClick = () => {
    setClicked(!clicked);
    playHit();
  };
  
  // Animations for different object types
  useFrame((state) => {
    if (!objectRef.current) return;
    
    const time = state.clock.getElapsedTime() + animationOffset;
    
    // Different animations based on object type
    switch (type) {
      case "tree":
        // Trees sway in the wind
        if (objectRef.current.children.length > 0) {
          const top = objectRef.current.children[1] as THREE.Mesh;
          top.rotation.x = Math.sin(time * 1.5) * 0.05;
          top.rotation.z = Math.cos(time) * 0.05;
        }
        break;
        
      case "lamppost":
        // Light flicker effect when hovered
        if (hovered && objectRef.current.children.length > 1) {
          const light = objectRef.current.children[1] as THREE.Mesh;
          const material = light.material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = 0.5 + Math.sin(time * 10) * 0.2;
        }
        break;
        
      case "mailbox":
        // Mailbox flag waves when clicked
        if (clicked && objectRef.current.children.length > 1) {
          const flag = objectRef.current.children[1] as THREE.Mesh;
          flag.rotation.z = Math.sin(time * 5) * 0.3;
        }
        break;
        
      case "hydrant":
        // Hydrant bounces when clicked
        if (clicked) {
          objectRef.current.position.y = position[1] + Math.abs(Math.sin(time * 5)) * 0.3;
        } else {
          objectRef.current.position.y = position[1];
        }
        break;
        
      case "bench":
        // Bench glows when hovered
        if (objectRef.current.children.length > 0) {
          const benchSeat = objectRef.current.children[0] as THREE.Mesh;
          const material = benchSeat.material as THREE.MeshStandardMaterial;
          
          if (hovered) {
            material.color.setHex(0xffeb3b); // Yellow glow
          } else {
            material.color.setHex(0x8d6e63); // Normal wood color
          }
        }
        break;
    }
    
    // General hover effect for all objects
    if (hovered) {
      objectRef.current.scale.set(
        scale[0] * 1.1,
        scale[1] * 1.1,
        scale[2] * 1.1
      );
    } else {
      objectRef.current.scale.set(scale[0], scale[1], scale[2]);
    }
  });

  return (
    <group
      ref={objectRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Render different 3D models based on type */}
      {type === "lamppost" && (
        <>
          {/* Lamppost pole */}
          <mesh castShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
            <meshStandardMaterial color="#37474F" roughness={0.8} />
          </mesh>
          
          {/* Lamp head */}
          <mesh castShadow position={[0, 4, 0.3]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial 
              color="#FFEE58" 
              emissive="#FFEE58" 
              emissiveIntensity={hovered ? 1 : 0.5} 
              roughness={0.3} 
            />
          </mesh>
          
          {/* Lamp arm */}
          <mesh castShadow position={[0, 3.8, 0.15]}>
            <boxGeometry args={[0.1, 0.1, 0.3]} />
            <meshStandardMaterial color="#37474F" roughness={0.8} />
          </mesh>
          
          {/* Add a point light */}
          <pointLight 
            position={[0, 4, 0.3]} 
            intensity={0.8} 
            distance={6} 
            color="#FFF59D" 
            castShadow
          />
        </>
      )}
      
      {type === "tree" && (
        <>
          {/* Tree trunk */}
          <mesh castShadow position={[0, 1, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={1} />
          </mesh>
          
          {/* Tree top */}
          <mesh castShadow position={[0, 3, 0]}>
            <coneGeometry args={[1.5, 3, 8]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.9} />
          </mesh>
        </>
      )}
      
      {type === "bench" && (
        <>
          {/* Bench seat */}
          <mesh castShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.6, 0.1, 2]} />
            <meshStandardMaterial color="#8D6E63" roughness={0.9} />
          </mesh>
          
          {/* Bench back */}
          <mesh castShadow position={[0.25, 1, 0]}>
            <boxGeometry args={[0.1, 1, 2]} />
            <meshStandardMaterial color="#8D6E63" roughness={0.9} />
          </mesh>
          
          {/* Bench legs */}
          <mesh castShadow position={[0, 0.2, -0.8]}>
            <boxGeometry args={[0.6, 0.4, 0.1]} />
            <meshStandardMaterial color="#5D4037" roughness={0.9} />
          </mesh>
          
          <mesh castShadow position={[0, 0.2, 0.8]}>
            <boxGeometry args={[0.6, 0.4, 0.1]} />
            <meshStandardMaterial color="#5D4037" roughness={0.9} />
          </mesh>
        </>
      )}
      
      {type === "hydrant" && (
        <>
          {/* Hydrant body */}
          <mesh castShadow position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.8, 12]} />
            <meshStandardMaterial color="#E53935" roughness={0.7} />
          </mesh>
          
          {/* Hydrant top */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#E53935" roughness={0.7} />
          </mesh>
          
          {/* Hydrant nozzles */}
          <mesh castShadow position={[0.25, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#BDBDBD" roughness={0.5} metalness={0.5} />
          </mesh>
          
          <mesh castShadow position={[0, 0.5, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color="#BDBDBD" roughness={0.5} metalness={0.5} />
          </mesh>
        </>
      )}
      
      {type === "mailbox" && (
        <>
          {/* Mailbox post */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.1, 1.2, 0.1]} />
            <meshStandardMaterial color="#5D4037" roughness={0.9} />
          </mesh>
          
          {/* Mailbox flag */}
          <mesh castShadow position={[0.15, 1, 0]} rotation={[0, 0, clicked ? Math.PI / 4 : 0]}>
            <boxGeometry args={[0.3, 0.2, 0.05]} />
            <meshStandardMaterial color="#E53935" roughness={0.7} />
          </mesh>
          
          {/* Mailbox body */}
          <mesh castShadow position={[0, 1.2, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.6]} />
            <meshStandardMaterial color="#1976D2" roughness={0.7} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default StreetObject;
