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
import StreetSignDOM from "./components/ui/StreetSignDOM";
import MobileControls from "./components/ui/MobileControls";
import { useMobileControls } from "./hooks/useMobileControls";
import { useIsMobile } from "./hooks/use-is-mobile";

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

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true); // State for collapsible instructions
  const [showMobileWelcome, setShowMobileWelcome] = useState(false);
  const [forceMobileMode, setForceMobileMode] = useState(false);
  
  const { setBackgroundMusic, toggleMute, isMuted } = useAudio();
  const { activeProject, closeProject } = usePortfolio();
  const { showAboutInfo, closeAboutInfo } = useStreetSign();
  const isMobileDetected = useIsMobile();
  const isMobile = forceMobileMode || isMobileDetected;

  // Show mobile welcome overlay on first mobile visit
  useEffect(() => {
    if (isMobile) {
      const hasSeenMobileWelcome = localStorage.getItem('hasSeenMobileWelcome');
      if (!hasSeenMobileWelcome) {
        setShowMobileWelcome(true);
        localStorage.setItem('hasSeenMobileWelcome', 'true');
        // Auto-hide after 8 seconds
        setTimeout(() => setShowMobileWelcome(false), 8000);
      }
    }
  }, [isMobile]);
  const { handleMove, handleLookAround, handleInteract } = useMobileControls();

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

      {/* Instructions overlay - COLLAPSIBLE - Show different instructions for mobile vs desktop */}
      <div className={`absolute top-5 z-50 ${isMobile ? 'left-2 right-2' : 'left-5'}`}>
        {/* Collapsible Instructions Panel */}
        <div className={`bg-black bg-opacity-70 text-white rounded ${isMobile ? 'max-w-full' : 'max-w-xs'}`}>
          {/* Header with toggle button */}
          <div 
            className="p-3 flex justify-between items-center cursor-pointer hover:bg-opacity-80 hover:bg-black" 
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <h2 className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
              {isMobile ? '📱 Mobile Controls & Interactions' : 'Controls & Interactions'}
            </h2>
            <div className="flex items-center gap-2">
              {/* Debug toggle for testing mobile mode */}
              {!isMobileDetected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setForceMobileMode(!forceMobileMode);
                  }}
                  className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                  title="Toggle mobile mode for testing"
                >
                  📱
                </button>
              )}
              <span className="text-xl font-bold">{showInstructions ? '−' : '+'}</span>
            </div>
          </div>
          
          {/* Collapsible content */}
          {showInstructions && (
            <div className={`border-t border-gray-600 ${isMobile ? 'p-2 pt-0 text-sm' : 'p-3 pt-0'}`}>
              {isMobile ? (
                // Mobile instructions
                <>
                  <div className="mt-2">
                    <p className="font-semibold text-blue-300">Movement:</p>
                    <p>• Use virtual joystick (bottom left) to move</p>
                    <p>• Push up/down to move forward/backward</p>
                    <p>• Push left/right to turn</p>
                  </div>
                  
                  <div className="mt-2 border-t pt-2 border-gray-600">
                    <p className="font-semibold text-green-300">Camera:</p>
                    <p>• Use look pad (bottom right) to look around</p>
                    <p>• Drag horizontally to rotate left/right</p>
                    <p>• Drag vertically to tilt up/down</p>
                  </div>
                  
                  <div className="mt-2 border-t pt-2 border-gray-600">
                    <p className="font-semibold text-yellow-300">Interaction:</p>
                    <p>• Tap "E" button (bottom center) when near objects</p>
                    <p>• Get close to houses/objects first</p>
                  </div>
                  
                  <div className="mt-2 border-t pt-2 border-gray-600">
                    <p className="font-semibold">What to Explore:</p>
                    <p>• Houses: View project details</p>
                    <p>• Mailbox: Play Hangman game</p>
                    <p>• Hydrant: Play Tic-Tac-Toe</p>
                    <p>• Trees: Play Checkers</p>
                    <p>• Seesaw & Fountain: Fun interactions</p>
                  </div>
                  
                  <div className="mt-2 border-t pt-2 border-gray-600">
                    <p className="font-semibold text-cyan-300">Tips:</p>
                    <p>• Use landscape orientation for best experience</p>
                    <p>• All games work fully on mobile</p>
                  </div>
                </>
              ) : (
                // Desktop instructions
                <>
                  <p>W/↑ - Move forward</p>
                  <p>S/↓ - Move backward</p>
                  <p>A/← - Turn left</p>
                  <p>D/→ - Turn right</p>
                  <p>E/Space - Interact with objects</p>
                  <p className="text-yellow-300">Click and hold left mouse button to look around</p>
                  <p className="text-yellow-300">+/- keys to zoom in/out</p>
                  
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
                </>
              )}
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
        isOpen={showAboutInfo}
        onClose={closeAboutInfo}
      />
      
      {/* Mobile Controls */}
      <MobileControls 
        onMove={handleMove}
        onInteract={handleInteract}
        onLookAround={handleLookAround}
      />

      {/* Mobile Welcome Overlay - First time mobile users */}
      {showMobileWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-center shadow-2xl">
            <div className="text-4xl mb-4">📱</div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">Welcome to Mobile!</h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Your 3D portfolio now works perfectly on mobile! Use the virtual controls at the bottom to explore.
            </p>
            <div className="space-y-2 text-left text-sm text-gray-700 mb-4">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🕹️</span>
                <span>Virtual joystick (left) to move</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mr-2">👀</span>
                <span>Look pad (right) to rotate view</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mr-2">E</span>
                <span>Interact button (center) for actions</span>
              </div>
            </div>
            <button
              onClick={() => setShowMobileWelcome(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Got it! Let's explore
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Tap the "+" in the top-left for detailed instructions
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;