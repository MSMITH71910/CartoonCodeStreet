import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
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

// Define control keys for the character movement
const keyboardMap = [
  { name: ControlName.forward, keys: ["KeyW", "ArrowUp"] },
  { name: ControlName.backward, keys: ["KeyS", "ArrowDown"] },
  { name: ControlName.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: ControlName.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: ControlName.interact, keys: ["KeyE", "Space"] },
  { name: ControlName.dance, keys: ["KeyZ"] },         // Z to dance
  { name: ControlName.waveLeft, keys: ["KeyQ"] },      // Q to wave left arm
  { name: ControlName.waveRight, keys: ["KeyR"] },     // R to wave right arm
];

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const { setBackgroundMusic, toggleMute, isMuted } = useAudio();
  const { activeProject, closeProject } = usePortfolio();

  // Complete audio initialization
  useEffect(() => {
    console.log("AUDIO SYSTEM: Initializing all audio elements");
    
    // First, create audio elements
    const backgroundMusicElement = new Audio("/sounds/background.mp3");
    backgroundMusicElement.loop = true;
    backgroundMusicElement.volume = 0.3;
    
    const hitSoundElement = new Audio("/sounds/hit.mp3");
    hitSoundElement.volume = 0.5;
    
    const successSoundElement = new Audio("/sounds/success.mp3");
    successSoundElement.volume = 0.5;
    
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
      hitSound: hitSoundElement,
      successSound: successSoundElement,
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

      {/* Instructions overlay */}
      <div className="absolute top-5 left-5 z-50 bg-black bg-opacity-70 text-white p-3 rounded max-w-xs">
        <h2 className="text-lg font-bold mb-2">Controls & Interactions</h2>
        <p>W/↑ - Move forward</p>
        <p>S/↓ - Move backward</p>
        <p>A/← - Turn left</p>
        <p>D/→ - Turn right</p>
        <p>E/Space - Interact with objects</p>
        <p className="text-yellow-300">Click and hold left mouse button to look around</p>
        
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
          <p>• Different activities play unique music</p>
          <p>• Toggle audio with the controls in top-right</p>
        </div>
      </div>

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
    </div>
  );
}

export default App;
