import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { ControlName } from "../lib/constants";
import { Project } from "../lib/data/projects";
import { usePortfolio } from "../lib/stores/usePortfolio";
import { useAudio } from "../lib/stores/useAudio";

interface HouseProps {
  position: [number, number, number];
  rotation: [number, number, number];
  project: Project;
}

const House = ({ position, rotation, project }: HouseProps) => {
  const houseRef = useRef<THREE.Group>(null);
  const { raycaster, camera } = useThree();
  const { characterRef, setActiveProject, isViewingProject } = usePortfolio();
  const interact = useKeyboardControls((state) => state[ControlName.interact]);
  
  const [isNearby, setIsNearby] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverScale, setHoverScale] = useState(1);
  const [doorOpen, setDoorOpen] = useState(false);
  
  const { playHit, playSuccess } = useAudio();
  
  // Use project's color or generate a color based on project ID
  const houseColor = useMemo(() => {
    if (project.color) {
      return project.color;
    }
    
    // Fallback colors if project.color is not provided
    const colors = [
      "#E53935", // Red
      "#43A047", // Green
      "#1E88E5", // Blue
      "#FDD835", // Yellow
      "#8E24AA", // Purple
      "#FB8C00", // Orange
      "#00ACC1", // Cyan
      "#5E35B1", // Deep Purple
      "#00897B", // Teal
      "#F4511E", // Deep Orange
    ];
    
    // Use project id to select a color
    const colorIndex = parseInt(project.id) % colors.length;
    return colors[colorIndex];
  }, [project.id, project.color]);
  
  // Animation for hovering and door opening
  useFrame((state, delta) => {
    if (!houseRef.current) return;
    
    // Hover effect animation
    if (isHovered) {
      setHoverScale(Math.min(hoverScale + delta * 2, 1.05));
    } else {
      setHoverScale(Math.max(hoverScale - delta * 2, 1.0));
    }
    
    houseRef.current.scale.set(hoverScale, hoverScale, hoverScale);
    
    // Proximity check to player
    if (characterRef && characterRef.current) {
      const distance = characterRef.current.position.distanceTo(
        new THREE.Vector3(position[0], position[1], position[2])
      );
      
      const wasNearby = isNearby;
      const newIsNearby = distance < 5; // Within 5 units of the house
      
      if (newIsNearby !== wasNearby) {
        console.log(`House ${project.title} proximity changed: ${newIsNearby ? 'NEARBY' : 'FAR'}, distance: ${distance.toFixed(2)}`);
      }
      
      setIsNearby(newIsNearby);
      
      // Play sound when player enters proximity
      if (newIsNearby && !wasNearby) {
        playHit();
        console.log(`Player entered proximity of ${project.title} house`);
      }
      
      // Check for interaction
      if (newIsNearby && interact && !isViewingProject) {
        console.log(`Interaction with house ${project.title}`);
        setDoorOpen(true);
        playSuccess();
        setActiveProject(project);
        
        // Reset door after 2 seconds
        setTimeout(() => {
          setDoorOpen(false);
        }, 2000);
      }
    }
  });
  
  // Handle hover state using raycasting
  useEffect(() => {
    const checkHover = () => {
      if (!characterRef || !characterRef.current || !houseRef.current || isViewingProject) return;
      
      // Calculate direction from character to house
      const characterPosition = characterRef.current.position;
      const housePosition = new THREE.Vector3(...position);
      
      // Check for a direct line of sight using raycasting
      const direction = housePosition
        .clone()
        .sub(characterPosition)
        .normalize();
      
      raycaster.set(characterPosition, direction);
      
      const intersects = raycaster.intersectObject(houseRef.current, true);
      setIsHovered(intersects.length > 0 && isNearby);
    };
    
    // Set up interval for hover check
    const hoverInterval = setInterval(checkHover, 200);
    
    return () => {
      clearInterval(hoverInterval);
    };
  }, [characterRef, position, isNearby, isViewingProject, raycaster]);
  
  // Debug logging
  useEffect(() => {
    console.log(`House for project "${project.title}" mounted at position:`, position);
  }, [project.title, position]);

  // Handler for direct mouse clicks on house
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // Stop propagation to prevent OrbitControls from capturing the event
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    
    console.log(`Mouse click on house: ${project.title}`);
    setDoorOpen(true);
    playSuccess();
    setActiveProject(project);
    
    // Reset door after 2 seconds
    setTimeout(() => {
      setDoorOpen(false);
    }, 2000);
  };

  return (
    <group 
      ref={houseRef} 
      position={position} 
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Base/foundation */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 1, 3]} />
        <meshStandardMaterial color="#8D6E63" roughness={1} />
      </mesh>
      
      {/* Main house body */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 3]} />
        <meshStandardMaterial color={houseColor} roughness={0.8} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[3, 1.5, 4]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} />
      </mesh>
      
      {/* Door */}
      <group position={[0, 1.2, 1.51]} rotation={[0, 0, 0]}>
        <mesh 
          position={[doorOpen ? -0.4 : 0, 0, 0]} 
          rotation={[0, doorOpen ? Math.PI / 2 : 0, 0]} 
          castShadow
        >
          <boxGeometry args={[0.8, 1.4, 0.1]} />
          <meshStandardMaterial color="#4E342E" roughness={0.7} />
        </mesh>
        
        {/* Door knob */}
        <mesh position={[0.3, 0, 0.06]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Windows */}
      <mesh position={[-1, 2, 1.51]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#B3E5FC" roughness={0.2} metalness={0.2} />
      </mesh>
      
      <mesh position={[1, 2, 1.51]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#B3E5FC" roughness={0.2} metalness={0.2} />
      </mesh>
      
      {/* Project sign - always visible */}
      <group position={[0, 4.5, 0]}>
        {/* Sign board */}
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        
        {/* Sign post */}
        <mesh position={[0, -1, 0]} castShadow>
          <boxGeometry args={[0.15, 1.5, 0.15]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} />
        </mesh>
        
        {/* Project name (canvas texture with text) */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.2, 0.5]} />
          <meshStandardMaterial 
            color="#8B0000" 
            emissive="#8B0000" 
            emissiveIntensity={0.2}
          >
            {/* Create dynamic canvas texture with project name */}
            {(() => {
              // Create a canvas for the texture
              const canvas = document.createElement('canvas');
              canvas.width = 256;
              canvas.height = 64;
              const context = canvas.getContext('2d');
              
              if (context) {
                // Background
                context.fillStyle = '#8B0000';
                context.fillRect(0, 0, canvas.width, canvas.height);
                
                // Text
                context.font = 'bold 28px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = '#FFFFFF';
                
                // Add project name, truncate if too long
                let displayName = project.title;
                if (displayName.length > 18) {
                  displayName = displayName.substring(0, 16) + "...";
                }
                context.fillText(displayName, canvas.width / 2, canvas.height / 2);
                
                // Create texture from canvas
                const texture = new THREE.CanvasTexture(canvas);
                return <primitive attach="map" object={texture} />;
              }
              
              return null;
            })()}
          </meshStandardMaterial>
        </mesh>
      </group>
      
      {/* Interactive indicator when player is nearby */}
      {isNearby && (
        <group position={[0, 5, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default House;
