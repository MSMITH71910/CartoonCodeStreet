import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAudio } from "../lib/stores/useAudio";
import { useInteraction } from "../lib/stores/useInteraction";
import { useKeyboardControls, Text } from "@react-three/drei";
import { ControlName } from "../lib/constants";
import { useMobileControls } from "../hooks/useMobileControls";

interface StreetObjectProps {
  type: "lamppost" | "tree" | "hydrant" | "mailbox" | "seesaw" | "fountain" | "sign";
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
  
  // Get interaction state and controls
  const { startInteraction, endInteraction, interactingWithId } = useInteraction();
  const { playActivityMusic, stopActivityMusic } = useAudio();
  const interact = useKeyboardControls((state) => state[ControlName.interact]);
  const { getControlState } = useMobileControls();

  // Generate a unique ID for this object
  const objectId = useMemo(() => `${type}-${position.join("-")}`, [type, position]);
  
  // Determine interaction type based on object type
  const getInteractionType = () => {
    switch (type) {
      case "seesaw": return "seesaw";
      case "lamppost": return "lamp";
      case "fountain": return "fountain"; // Now handled directly
      default: return "none";
    }
  };
  
  // Handle mini-games based on object type
  const getMiniGameType = () => {
    switch (type) {
      case "mailbox": return "hangman";
      case "hydrant": return "ticTacToe";
      case "tree": return "checkers";
      default: return null;
    }
  };
  
  // Determine the music type based on activity
  const getActivityMusicType = () => {
    // Get the mini-game type if applicable
    const miniGame = getMiniGameType();
    
    console.log(`MUSIC DEBUG: Getting activity music for object type=${type}, miniGame=${miniGame}`);
    
    if (miniGame) {
      // If this is a mini-game object, return the chess music
      console.log(`MUSIC DEBUG: Using chess music for mini-game: ${miniGame}`);
      return "chess"; // Use generic "chess" for all mini-games
    }
    
    // Otherwise check regular interactions
    switch (type) {
      case "fountain": return "fountain";
      case "seesaw": return "seesaw";
      default: return null;
    }
  };
  
  // Interaction handlers
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  
  const handleClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    
    // Toggle clicked state for visual feedback
    setClicked(!clicked);
    playHit();
    
    // Special case for fountain
    if (type === "fountain") {
      console.log("INTERACTION: Handling fountain interaction");
      
      // Create interaction position for fountain (just for state tracking)
      const fountainPos = new THREE.Vector3(
        position[0],
        position[1],
        position[2]
      );
      
      // Start a proper interaction with the fountain to track it correctly
      startInteraction("fountain", objectId, fountainPos, rotation[1]);
      
      // EXPLICITLY PLAY fountain music directly (same pattern as other interactions)
      console.log("MUSIC DEBUG: Directly playing fountain music for fountain interaction");
      playActivityMusic("fountain"); 
      return;
    }
    
    // Determine interaction position (offset for different objects)
    let interactPos = new THREE.Vector3(position[0], position[1], position[2]);
    let interactRot = rotation[1]; // Use Y rotation
    
    if (type === "seesaw") {
      // Position character on one end of seesaw
      interactPos = new THREE.Vector3(
        position[0],          // Same X
        position[1] + 0.7,    // Height of seesaw
        position[2] + 1.2     // End of seesaw
      );
      interactRot = rotation[1]; // Face along seesaw
    }
    
    // Start appropriate interaction based on object type
    const interactionType = getInteractionType();
    const miniGameType = getMiniGameType();
    
    console.log(`MUSIC DEBUG: Object clicked - interactionType=${interactionType}, miniGameType=${miniGameType}`);
    
    // Get music type before starting interaction
    const musicType = getActivityMusicType();
    console.log(`MUSIC DEBUG: Activity music type: ${musicType}`);
    
    if (interactionType !== "none") {
      console.log(`MUSIC DEBUG: Starting standard interaction with music: ${musicType}`);
      startInteraction(interactionType, objectId, interactPos, interactRot);
      
      // DIRECTLY TRIGGER MUSIC - This ensures music plays for normal interactions
      if (musicType) {
        console.log(`MUSIC DEBUG: Directly playing music "${musicType}" for interaction: ${interactionType}`);
        playActivityMusic(musicType);
      }
    } 
    else if (miniGameType) {
      console.log(`MUSIC DEBUG: Starting mini-game interaction: ${miniGameType} with music: ${musicType}`);
      startInteraction(miniGameType, objectId, interactPos, interactRot);
      
      // DIRECTLY TRIGGER MUSIC - This ensures music plays for mini-games
      if (musicType) {
        console.log(`MUSIC DEBUG: Directly playing music "${musicType}" for mini-game: ${miniGameType}`);
        playActivityMusic(musicType);
      }
    }
  };
  
  // Removed basketball hoop state
  
  // Fountain particles
  const [particles, setParticles] = useState<Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    life: number;
  }>>([]);
  
  // Animations for different object types
  useFrame((state, delta) => {
    if (!objectRef.current) return;
    
    const time = state.clock.getElapsedTime() + animationOffset;
    
    // Handle mobile interaction
    const mobileControls = getControlState();
    if (mobileControls.isMobile && mobileControls.interact) {
      // Check if character is near this object for mobile interaction
      const { camera } = state;
      const objectPosition = new THREE.Vector3(...position);
      const cameraPosition = camera.position.clone();
      const distance = cameraPosition.distanceTo(objectPosition);
      
      // If close enough, trigger interaction (similar to keyboard E press)
      if (distance < 5) {
        handleClick({ stopPropagation: () => {} });
      }
    }
    
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
        // Light effects for lamps
        if (objectRef.current.children.length > 1) {
          const light = objectRef.current.children[1] as THREE.Mesh;
          const material = light.material as THREE.MeshStandardMaterial;
          const pointLight = objectRef.current.children[3] as THREE.PointLight;
          
          if (interactingWithId === objectId) {
            // Lamp is active from interaction
            material.emissiveIntensity = 1.0;
            pointLight.intensity = 1.5;
          } else if (hovered) {
            // Lamp is hovered
            material.emissiveIntensity = 0.5 + Math.sin(time * 10) * 0.2;
            pointLight.intensity = 0.8;
          } else if (clicked) {
            // Lamp was clicked but not actively interacting
            material.emissiveIntensity = 0.8;
            pointLight.intensity = 1.0;
          } else {
            // Default state
            material.emissiveIntensity = 0.3;
            pointLight.intensity = 0.5;
          }
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
        
      // Bench case removed
        
      // Basketball case completely removed
        
      case "seesaw":
        // Seesaw animation - tilts back and forth when clicked
        if (clicked) {
          if (objectRef.current.children.length > 0) {
            const board = objectRef.current.children[0] as THREE.Mesh;
            board.rotation.z = Math.sin(time * 2) * 0.3;
          }
        }
        break;
        
      case "fountain":
        // Fountain particles animation
        if (clicked) {
          // Create new particles occasionally
          if (Math.random() < 0.3) {
            const newParticles = [...particles];
            
            // Add some new particles
            for (let i = 0; i < 3; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 0.5 + Math.random() * 1.5;
              newParticles.push({
                position: new THREE.Vector3(
                  position[0], 
                  position[1] + 1.2, 
                  position[2]
                ),
                velocity: new THREE.Vector3(
                  Math.cos(angle) * 0.3,
                  speed,
                  Math.sin(angle) * 0.3
                ),
                life: 1.0
              });
            }
            
            setParticles(newParticles);
          }
          
          // Update existing particles
          setParticles(currentParticles => 
            currentParticles
              .map(particle => ({
                ...particle,
                position: particle.position.clone().add(
                  particle.velocity.clone().multiplyScalar(delta)
                ),
                velocity: new THREE.Vector3(
                  particle.velocity.x,
                  particle.velocity.y - 9.8 * delta, // gravity
                  particle.velocity.z
                ),
                life: particle.life - delta
              }))
              // Remove dead particles
              .filter(particle => particle.life > 0)
          );
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
      
      {/* Bench component removed */}
      
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
      
      {/* Basketball feature removed */}
      
      {type === "seesaw" && (
        <>
          {/* Seesaw board */}
          <mesh castShadow position={[0, 0.6, 0]} rotation={[0, 0, clicked ? Math.PI / 12 : 0]}>
            <boxGeometry args={[0.3, 0.05, 3]} />
            <meshStandardMaterial color="#1E88E5" roughness={0.6} />
          </mesh>
          
          {/* Seesaw fulcrum */}
          <mesh castShadow position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.6, 12]} />
            <meshStandardMaterial color="#78909C" roughness={0.7} />
          </mesh>
          
          {/* Handles */}
          <mesh castShadow position={[0, 0.7, -1.4]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
            <meshStandardMaterial color="#F44336" roughness={0.5} />
          </mesh>
          
          <mesh castShadow position={[0, 0.7, 1.4]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
            <meshStandardMaterial color="#F44336" roughness={0.5} />
          </mesh>
          
          {/* Info text */}
          <group position={[0, 1, 0]}>
            <mesh visible={hovered}>
              <planeGeometry args={[1, 0.3]} />
              <meshBasicMaterial transparent opacity={0.8} color="#000000" />
            </mesh>
          </group>
        </>
      )}
      
      {type === "fountain" && (
        <>
          {/* Fountain base */}
          <mesh castShadow position={[0, 0.3, 0]}>
            <cylinderGeometry args={[1, 1.2, 0.6, 24]} />
            <meshStandardMaterial color="#90A4AE" roughness={0.6} />
          </mesh>
          
          {/* Fountain middle section */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.6, 0.7, 0.4, 24]} />
            <meshStandardMaterial color="#78909C" roughness={0.5} />
          </mesh>
          
          {/* Fountain top section */}
          <mesh castShadow position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
            <meshStandardMaterial color="#607D8B" roughness={0.5} />
          </mesh>
          
          {/* Water particles */}
          {particles.map((particle, index) => (
            <mesh 
              key={index} 
              position={particle.position.toArray()} 
              scale={[0.05, 0.05, 0.05]}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial 
                color="#29B6F6" 
                transparent 
                opacity={particle.life} 
                emissive="#29B6F6" 
                emissiveIntensity={0.3} 
              />
            </mesh>
          ))}
          
          {/* Water in base */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.9, 0.9, 0.1, 24]} />
            <meshStandardMaterial 
              color="#29B6F6" 
              transparent 
              opacity={0.7} 
              roughness={0}
              metalness={0.1}
            />
          </mesh>
          
          {/* Point light for glow effect when active */}
          {clicked && (
            <pointLight 
              position={[0, 1.5, 0]} 
              intensity={0.8} 
              distance={3} 
              color="#29B6F6" 
            />
          )}
        </>
      )}
      
      {type === "sign" && (
        <>
          {/* Sign posts - two sturdy poles */}
          <mesh castShadow position={[-2, 2, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          <mesh castShadow position={[2, 2, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Large billboard sign */}
          <group position={[0, 3.5, 0]}>
            {/* Main sign background */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[5, 2, 0.2]} />
              <meshStandardMaterial color={hovered ? "#4285F4" : "#1E88E5"} />
            </mesh>
            
            {/* Sign border */}
            <mesh position={[0, 0, 0.11]}>
              <boxGeometry args={[5.2, 2.2, 0.01]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            
            {/* Inner part with text effect */}
            <mesh position={[0, 0, 0.12]}>
              <boxGeometry args={[4.8, 1.8, 0.01]} />
              <meshStandardMaterial color={hovered ? "#4285F4" : "#1E88E5"} />
            </mesh>
            
            {/* Sign title */}
            <Text
              position={[0, 0.5, 0.2]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              PORTFOLIO STREET
            </Text>
            
            {/* Sign subtitle */}
            <Text
              position={[0, 0, 0.2]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Michael R Smith
            </Text>
            
            {/* Technologies used */}
            <Text
              position={[0, -0.4, 0.2]}
              fontSize={0.12}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Built with React, Three.js & TypeScript
            </Text>
          </group>
          
          {/* Info panel when clicked */}
          {clicked && (
            <group position={[0, 3.5, 1]}>
              {/* Background with border */}
              <mesh>
                <boxGeometry args={[6, 4, 0.2]} />
                <meshStandardMaterial color="#333333" transparent opacity={0.95} />
              </mesh>
              
              {/* Border */}
              <mesh position={[0, 0, 0.11]}>
                <boxGeometry args={[6.2, 4.2, 0.01]} />
                <meshStandardMaterial color="#555555" />
              </mesh>
              
              {/* Header */}
              <mesh position={[0, 1.7, 0.15]}>
                <boxGeometry args={[5.8, 0.6, 0.01]} />
                <meshStandardMaterial color="#1A237E" />
              </mesh>
              
              {/* Footer */}
              <mesh position={[0, -1.7, 0.15]}>
                <boxGeometry args={[5.8, 0.6, 0.01]} />
                <meshStandardMaterial color="#1A237E" />
              </mesh>
              
              {/* Header Text */}
              <Text
                position={[0, 1.7, 0.2]}
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                WELCOME TO MY PORTFOLIO
              </Text>
              
              {/* Main content */}
              <Text
                position={[0, 0.8, 0.2]}
                fontSize={0.15}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={5}
              >
                Controls:
              </Text>
              
              <Text
                position={[0, 0.3, 0.2]}
                fontSize={0.12}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={5}
              >
                WASD / Arrow Keys: Move character
              </Text>
              
              <Text
                position={[0, 0, 0.2]}
                fontSize={0.12}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={5}
              >
                E: Interact with objects
              </Text>
              
              <Text
                position={[0, -0.3, 0.2]}
                fontSize={0.12}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={5}
              >
                Mouse: Click + hold to look around
              </Text>
              
              <Text
                position={[0, -0.6, 0.2]}
                fontSize={0.12}
                color="white"
                anchorX="center"
                anchorY="middle"
                maxWidth={5}
              >
                Z: Dance | Q: Wave Left | R: Wave Right
              </Text>
              
              <Text
                position={[0, -1.7, 0.2]}
                fontSize={0.12}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                Click houses to view projects | Try the mini-games!
              </Text>
            </group>
          )}
        </>
      )}
    </group>
  );
};

export default StreetObject;
