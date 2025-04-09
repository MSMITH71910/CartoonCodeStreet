import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import Experience from "./components/Experience";
import ProjectDetails from "./components/ProjectDetails";
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
    // Setup background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);

    // Setup sound effects in useAudio store
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    useAudio.setState({
      hitSound,
      successSound,
    });

    // Show the canvas once everything is loaded
    setShowCanvas(true);
  }, [setBackgroundMusic]);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Sound control button */}
      <button 
        onClick={toggleMute} 
        className="absolute top-5 right-5 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* Instructions overlay */}
      <div className="absolute top-5 left-5 z-50 bg-black bg-opacity-50 text-white p-3 rounded max-w-xs">
        <h2 className="text-lg font-bold mb-2">Controls</h2>
        <p>W/↑ - Move forward</p>
        <p>S/↓ - Move backward</p>
        <p>A/← - Turn left</p>
        <p>D/→ - Turn right</p>
        <p>E/Space - Interact</p>
      </div>

      {showCanvas && (
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{
              position: [0, 5, 10],
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
