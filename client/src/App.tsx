import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import Experience from "./components/Experience";
import ProjectDetails from "./components/ProjectDetails";
import AudioControls from "./components/ui/AudioControls";
import GameUI from "./components/games/GameUI";
import AboutInfoDialog from "./components/ui/AboutInfoDialog";
import { usePortfolio } from "./lib/stores/usePortfolio";
import { useStreetSign } from "./lib/stores/useStreetSign";
import { ControlName } from "./lib/constants";
import StreetSignDOM from "./components/ui/StreetSignDOM";

// Define control keys for the character movement - UPDATED FOR ANIMATIONS & ZOOM
const keyboardMap = [
  { name: ControlName.forward, keys: ["KeyW", "ArrowUp"] },
  { name: ControlName.backward, keys: ["KeyS", "ArrowDown"] },
  { name: ControlName.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: ControlName.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: ControlName.interact, keys: ["KeyE", "Space"] },
  // Animation keys explicitly set as priorities
  { name: ControlName.dance, keys: ["KeyZ"] },         // Z to dance
  { name: ControlName.waveLeft, keys: ["KeyQ"] },      // Q to wave left arm
  { name: ControlName.waveRight, keys: ["KeyR"] },     // R to wave right arm
  // Zoom controls
  { name: ControlName.zoomIn, keys: ["Equal", "NumpadAdd"] },   // + key to zoom in
  { name: ControlName.zoomOut, keys: ["Minus", "NumpadSubtract"] },  // - key to zoom out
];

// Create a persistent zoom state using localStorage
const useZoomState = () => {
  // Default zoom level (0 = normal, negative = zoomed in, positive = zoomed out)
  const [zoomLevel, setZoomLevel] = useState(0);
  
  // Initialize from localStorage if available
  useEffect(() => {
    const storedZoom = localStorage.getItem('portfolioZoomLevel');
    if (storedZoom !== null) {
      setZoomLevel(parseInt(storedZoom));
    }
  }, []);
  
  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('portfolioZoomLevel', zoomLevel.toString());
    // Also expose to window for Experience component to access
    window.currentZoomLevel = zoomLevel;
  }, [zoomLevel]);
  
  // Handle zoom keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Equal' || e.code === 'NumpadAdd') {
        // Zoom in (decrease level - smaller values are more zoomed in)
        setZoomLevel(prev => Math.max(prev - 1, -5));
        console.log("ZOOM SYSTEM: Zooming in to level", zoomLevel - 1);
      }
      else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
        // Zoom out (increase level - larger values are more zoomed out)
        setZoomLevel(prev => Math.min(prev + 1, 5)); 
        console.log("ZOOM SYSTEM: Zooming out to level", zoomLevel + 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel]);
  
  return zoomLevel;
};

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true); // State for collapsible instructions
  const { setBackgroundMusic, toggleMute, isMuted } = useAudio();
  const { activeProject, closeProject } = usePortfolio();
  
  // Initialize zoom system
  const zoomLevel = useZoomState();
  
  // Make the zoom available globally
  useEffect(() => {
    // @ts-ignore - Adding custom property
    window.currentZoomLevel = zoomLevel;
    console.log("ZOOM SYSTEM: Current zoom level:", zoomLevel);
  }, [zoomLevel]);

  // BACKUP KEYBOARD EVENT LISTENERS FOR ANIMATIONS
  useEffect(() => {
    // These direct event listeners will handle animation keys as a backup
    // in case the regular keyboard controls don't work
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle our special animation keys
      if (e.code === 'KeyZ' || e.code === 'KeyQ' || e.code === 'KeyR') {
        console.log(`GLOBAL APP KEY DETECTED: ${e.code}`);
        
        // Store animation state in window for components to access
        if (!window.animationKeys) {
          window.animationKeys = {
            Z: false,
            Q: false,
            R: false
          };
        }
        
        if (e.code === 'KeyZ') window.animationKeys.Z = true;
        if (e.code === 'KeyQ') window.animationKeys.Q = true; 
        if (e.code === 'KeyR') window.animationKeys.R = true;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyZ' || e.code === 'KeyQ' || e.code === 'KeyR') {
        if (!window.animationKeys) return;
        
        if (e.code === 'KeyZ') window.animationKeys.Z = false;
        if (e.code === 'KeyQ') window.animationKeys.Q = false;
        if (e.code === 'KeyR') window.animationKeys.R = false;
      }
    };
    
    // Add global event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Complete audio initialization
  useEffect(() => {
    console.log("AUDIO SYSTEM: Initializing all audio elements");
    
    // First, create audio elements
    const backgroundMusicElement = new Audio("/sounds/background.mp3");
    backgroundMusicElement.loop = true;
    backgroundMusicElement.volume = 0.3;
    
    // No longer using sound effects to prevent clicking sounds
    // const hitSoundElement = new Audio("/sounds/hit.mp3");
    // const successSoundElement = new Audio("/sounds/success.mp3");
    
    const boardGameMusicElement = new Audio("/sounds/board-game.mp3");
    boardGameMusicElement.loop = true;
    boardGameMusicElement.volume = 0.4;
    
    const fountainMusicElement = new Audio("/sounds/fountain.mp3");
    fountainMusicElement.loop = true;
    fountainMusicElement.volume = 0.4;
    
    const seesawMusicElement = new Audio("/sounds/playground.mp3");
    seesawMusicElement.loop = true;
    seesawMusicElement.volume = 0.4;
    
    // Set initial state - START WITH MUSIC UNMUTED by default
    // We'll explicitly manage tracks in the audio store
    useAudio.setState({
      // Reset all audio tracks
      backgroundMusic: backgroundMusicElement,
      hitSound: null, // Remove sound effects entirely
      successSound: null, // Remove sound effects entirely
      // If any of the mini-game music files don't load properly, we'll use the background music as fallback
      chessMusicOrSimilar: boardGameMusicElement || backgroundMusicElement,
      fountainMusic: fountainMusicElement || backgroundMusicElement,
      seesawMusic: seesawMusicElement || backgroundMusicElement,
      
      // Start with music UNMUTED for better user experience
      isMusicMuted: false,
      
      // Set the current track
      currentTrack: "background",
      currentActivityMusic: null
    });
    
    // Ensure initialization is complete
    console.log("AUDIO SYSTEM: All audio elements initialized");
    
    // Show the canvas once everything is loaded
    setShowCanvas(true);
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Audio controls component */}
      <AudioControls />

      {/* Instructions overlay - COLLAPSIBLE */}
      <div className="absolute top-5 left-5 z-50">
        {/* Collapsible Instructions Panel */}
        <div className="bg-black bg-opacity-70 text-white rounded max-w-xs">
          {/* Header with toggle button */}
          <div 
            className="p-3 flex justify-between items-center cursor-pointer hover:bg-opacity-80 hover:bg-black" 
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <h2 className="text-lg font-bold">Controls & Interactions</h2>
            <span className="text-xl font-bold">{showInstructions ? '−' : '+'}</span>
          </div>
          
          {/* Collapsible content */}
          {showInstructions && (
            <div className="p-3 pt-0 border-t border-gray-600">
              <p>W/↑ - Move forward</p>
              <p>S/↓ - Move backward</p>
              <p>A/← - Turn left</p>
              <p>D/→ - Turn right</p>
              <p>E/Space - Interact with objects</p>
              <p className="text-yellow-300">Click and hold left mouse button to look around</p>
              <p className="text-yellow-300">+/- keys to zoom in/out</p>
              
              <div className="mt-2 border-t pt-2 border-gray-600">
                <p className="font-semibold text-green-300">Character Animations:</p>
                <p>Z - Make character dance</p>
                <p>Q - Wave left arm</p>
                <p>R - Wave right arm</p>
              </div>
              
              <div className="mt-2 border-t pt-2 border-gray-600">
                <p className="font-semibold">Interactions:</p>
                <p>• Click houses to view projects</p>
                <p>• Interact with seesaw for fun</p>
                <p>• Interact with mailbox for Hangman</p>
                <p>• Visit hydrants for Tic-Tac-Toe</p>
                <p>• Trees allow playing Checkers</p>
              </div>
              <div className="mt-2 border-t pt-2 border-gray-600">
                <p className="font-semibold text-cyan-300">Audio Features:</p>
                <p>• Background music plays during exploration</p>
                <p>• Music pauses during interactive activities</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STREET SIGN OVERLAY - DOM-based for guaranteed fixed position */}
      <StreetSignDOM />

      {showCanvas && (
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{
              position: [0, 5, 10], // Reverted back to original position
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#87CEEB"]} />
            <fog attach="fog" args={["#87CEEB", 30, 95]} />
            
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </KeyboardControls>
      )}

      {/* Project details overlay */}
      {activeProject && (
        <ProjectDetails project={activeProject} onClose={closeProject} />
      )}
      
      {/* Mini-games UI */}
      <GameUI />
      
      {/* About Info Dialog */}
      <AboutInfoDialog 
        isOpen={useStreetSign(state => state.showAboutInfo)}
        onClose={useStreetSign(state => state.closeAboutInfo)}
      />
      
      {/* Current zoom level display - visible for debugging */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 text-white rounded">
        Zoom Level: {zoomLevel} {zoomLevel < 0 ? "(Zoomed In)" : zoomLevel > 0 ? "(Zoomed Out)" : "(Normal)"}
      </div>
    </div>
  );
}

export default App;
