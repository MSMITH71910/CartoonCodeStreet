import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import Experience from "./components/Experience";
import ProjectDetails from "./components/ProjectDetails";
import AudioControls from "./components/ui/AudioControls";
import { usePortfolio } from "./lib/stores/usePortfolio";
import { ControlName } from "./lib/constants";

// Define control keys for the character movement
const keyboardMap = [
  { name: ControlName.forward, keys: ["KeyW", "ArrowUp"] },
  { name: ControlName.backward, keys: ["KeyS", "ArrowDown"] },
  { name: ControlName.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: ControlName.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: ControlName.interact, keys: ["KeyE", "Space"] },
];

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const { setBackgroundMusic, toggleMute, isMuted } = useAudio();
  const { activeProject, closeProject } = usePortfolio();

  // Initialize audio elements
  useEffect(() => {
    // Setup background music - start MUTED by default
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0;
    setBackgroundMusic(bgMusic);

    // Setup sound effects in useAudio store
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    // Setup activity-specific music - all muted by default
    const basketballMusic = new Audio("/sounds/basketball.mp3");
    basketballMusic.volume = 0;
    
    const chessMusicOrSimilar = new Audio("/sounds/board-game.mp3");
    chessMusicOrSimilar.volume = 0;
    
    const fountainMusic = new Audio("/sounds/fountain.mp3");
    fountainMusic.volume = 0;
    
    const seesawMusic = new Audio("/sounds/playground.mp3");
    seesawMusic.volume = 0;
    
    // Initialize all audio in store - start with music muted
    useAudio.setState({
      hitSound,
      successSound,
      basketballMusic,
      chessMusicOrSimilar,
      fountainMusic,
      seesawMusic,
      isMusicMuted: true, // Start with music muted
    });
    
    // Make sure the audio store knows music is muted
    useAudio.getState().toggleMusicMute();

    // Show the canvas once everything is loaded
    setShowCanvas(true);
  }, [setBackgroundMusic]);

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
        <div className="mt-2 border-t pt-2 border-gray-600">
          <p className="font-semibold">Interactions:</p>
          <p>• Click houses to view projects</p>
          <p>• Use benches to sit down</p>
          <p>• Play basketball at the hoops</p>
          <p>• Interact with mailbox for Hangman</p>
          <p>• Visit hydrants for Tic-Tac-Toe</p>
          <p>• Trees allow playing Checkers</p>
        </div>
        <div className="mt-2 border-t pt-2 border-gray-600">
          <p>Different activities play unique music!</p>
        </div>
      </div>

      {showCanvas && (
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{
              position: [0, 5, -10], // Changed Z from 10 to -10 to face the character
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
    </div>
  );
}

export default App;
