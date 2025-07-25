import { useMemo, useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import House from "./House";
import StreetObject from "./StreetObject";
import StreetSign from "./StreetSign";
import { projects } from "../lib/data/projects";

const Street = () => {
  // Load textures
  const asphaltTexture = useTexture("/textures/asphalt.png");
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure textures
  useMemo(() => {
    [asphaltTexture, grassTexture].forEach((texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(20, 100);
    });
    
    grassTexture.repeat.set(10, 50);
  }, [asphaltTexture, grassTexture]);

  // Define types for street objects
  type StreetObjectType = "lamppost" | "tree" | "hydrant" | "mailbox" | "seesaw" | "fountain";
  
  interface StreetObjectData {
    type: StreetObjectType;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  }
  
  // Pre-calculate street object positions
  const streetObjectPositions = useMemo<StreetObjectData[]>(() => {
    // Generate deterministic positions for street objects
    const positions: StreetObjectData[] = [];
    
    // Lamp posts along the street
    for (let i = -45; i <= 45; i += 10) {
      positions.push({
        type: "lamppost",
        position: [-5, 0, i],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      });
      
      positions.push({
        type: "lamppost",
        position: [5, 0, i],
        rotation: [0, Math.PI, 0],
        scale: [1, 1, 1]
      });
    }
    
    // Trees on the grass areas only
    for (let i = -48; i <= 48; i += 8) {
      if (i % 16 === 0) continue; // Skip some positions for variety
      
      // Left side trees - deeper on the grass (x = -14 to -18)
      positions.push({
        type: "tree",
        position: [-16 + Math.sin(i * 0.5) * 2, 0, i],
        rotation: [0, Math.sin(i) * 0.5, 0],
        scale: [0.8 + Math.sin(i * 0.3) * 0.2, 0.8 + Math.cos(i * 0.4) * 0.2, 0.8 + Math.sin(i * 0.5) * 0.2]
      });
      
      // Right side trees - deeper on the grass (x = 14 to 18)
      positions.push({
        type: "tree",
        position: [16 + Math.cos(i * 0.5) * 2, 0, i],
        rotation: [0, Math.cos(i) * 0.5, 0],
        scale: [0.8 + Math.cos(i * 0.3) * 0.2, 0.8 + Math.sin(i * 0.4) * 0.2, 0.8 + Math.cos(i * 0.5) * 0.2]
      });
    }
    
    // Benches have been removed as requested
    
    // Fire hydrants
    for (let i = -35; i <= 35; i += 25) {
      positions.push({
        type: "hydrant",
        position: [-6, 0, i],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      });
      
      positions.push({
        type: "hydrant",
        position: [6, 0, i + 10],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      });
    }
    
    // Add mailboxes at the left front corner of each house
    projects.forEach((project, index) => {
      // Alternate houses on left and right side of the street
      const side = index % 2 === 0 ? -1 : 1;
      // Space houses evenly along the street
      const zPosition = -40 + index * 15;
      // Calculate house position (same as in the house rendering below)
      const xOffset = side * (10 + Math.sin(index * 0.5) * 2);
      
      // Position mailbox at the left front corner of each house (relative to the house orientation)
      // Houses on the left side of the street face right, so their "left front" is toward positive z
      // Houses on the right side of the street face left, so their "left front" is toward negative z
      positions.push({
        type: "mailbox",
        position: [
          // Move closer to the sidewalk from house position
          side === -1 ? xOffset + 2 : xOffset - 2,
          0, 
          // Left front corner (accounting for house rotation)
          side === -1 ? zPosition + 2 : zPosition - 2
        ],
        // Rotate to face the street
        rotation: [0, side === -1 ? Math.PI / 4 : -Math.PI / 4, 0],
        scale: [1, 1, 1]
      });
    });
    
    // Basketball courts removed as requested
    
    // Add seesaws (playground)
    positions.push({
      type: "seesaw",
      position: [-15, 0, 0],
      rotation: [0, Math.PI / 6, 0],
      scale: [1, 1, 1]
    });
    
    positions.push({
      type: "seesaw",
      position: [15, 0, -18],
      rotation: [0, -Math.PI / 6, 0],
      scale: [1, 1, 1]
    });
    
    // Fountains have been removed as requested
    
    return positions;
  }, []);
  
  // Debug logging
  useEffect(() => {
    console.log("Street component mounted with", projects.length, "projects");
    console.log("Street objects:", streetObjectPositions.length);
  }, [streetObjectPositions.length]);

  return (
    <group>
      {/* Main street (asphalt) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial 
          map={asphaltTexture} 
          color="#333333" 
          roughness={0.8} 
          metalness={0.2} 
        />
      </mesh>

      {/* Sidewalks - adjusted to match the new bench positions */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0.05, 0]} receiveShadow>
        <planeGeometry args={[4, 100]} />
        <meshStandardMaterial color="#888888" roughness={1} metalness={0} />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.05, 0]} receiveShadow>
        <planeGeometry args={[4, 100]} />
        <meshStandardMaterial color="#888888" roughness={1} metalness={0} />
      </mesh>

      {/* Grass areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-14, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial 
          map={grassTexture} 
          color="#4CAF50" 
          roughness={1} 
          metalness={0} 
        />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[14, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial 
          map={grassTexture} 
          color="#4CAF50" 
          roughness={1} 
          metalness={0} 
        />
      </mesh>
      
      {/* Base ground plane (extends far beyond the visible street) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#3e3e3e" />
      </mesh>
      
      {/* Road markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[0.3, 100]} />
        <meshStandardMaterial color="white" roughness={1} metalness={0} />
      </mesh>
      
      {/* Project houses */}
      {projects.map((project, index) => {
        // Alternate houses on left and right side of the street
        const side = index % 2 === 0 ? -1 : 1;
        // Space houses evenly along the street
        const zPosition = -40 + index * 15;
        // Add slight randomness to position and rotation
        const xOffset = side * (10 + Math.sin(index * 0.5) * 2);
        const rotationY = side === -1 ? Math.PI / 2 : -Math.PI / 2;
        
        // Explicitly type the position and rotation as [number, number, number]
        const position: [number, number, number] = [xOffset, 0, zPosition];
        const rotation: [number, number, number] = [0, rotationY, 0];
        
        return (
          <House
            key={project.id}
            position={position}
            rotation={rotation}
            project={project}
          />
        );
      })}
      
      {/* Street objects (lamps, trees, benches, etc.) */}
      {streetObjectPositions.map((obj, index) => (
        <StreetObject
          key={`street-object-${index}`}
          type={obj.type}
          position={obj.position}
          rotation={obj.rotation}
          scale={obj.scale}
        />
      ))}
      {/* Street sign is now directly in Experience component */}
    </group>
  );
};

export default Street;
