import React, { useEffect, useState } from 'react';
import { useAudio } from '../../lib/stores/useAudio';

// COMPLETELY REWRITTEN AUDIO CONTROLS
const AudioControls: React.FC = () => {
  // Get audio state from store
  const { 
    isMuted, 
    isMusicMuted,
    backgroundMusic,
    currentActivityMusic,
    chessMusicOrSimilar,
    fountainMusic,
    seesawMusic
  } = useAudio();

  // Track expanded state for controls panel
  const [isExpanded, setIsExpanded] = useState(false);
  
  // DIRECT ACTION FUNCTIONS - Skip the store and work with audio elements directly
  // This bypasses any potential issues with the store not updating correctly
  
  // Toggle all audio mute
  const handleToggleMute = () => {
    console.log("DIRECT MUTE: Toggling all audio mute");
    
    // Get current state
    const currentlyMuted = useAudio.getState().isMuted;
    const newMuteState = !currentlyMuted;
    
    // Update state via direct access
    useAudio.setState({ isMuted: newMuteState });
    
    // Get all audio elements
    const allAudio = [
      backgroundMusic,
      currentActivityMusic,
      chessMusicOrSimilar,
      fountainMusic,
      seesawMusic
    ].filter(Boolean) as HTMLAudioElement[];
    
    if (newMuteState) {
      // Direct muting of all audio elements
      allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      });
      console.log("DIRECT MUTE: All audio muted");
    } else {
      // Only restore if music is not separately muted
      if (!useAudio.getState().isMusicMuted) {
        console.log("DIRECT MUTE: Restoring audio");
        // Set volumes
        if (backgroundMusic) backgroundMusic.volume = 0.3;
        if (chessMusicOrSimilar) chessMusicOrSimilar.volume = 0.4;
        if (fountainMusic) fountainMusic.volume = 0.4;
        if (seesawMusic) seesawMusic.volume = 0.4;
        
        // Play appropriate track
        if (currentActivityMusic) {
          currentActivityMusic.play().catch(e => console.error("Failed to play activity music:", e));
        } else if (backgroundMusic) {
          backgroundMusic.play().catch(e => console.error("Failed to play background music:", e));
        }
      }
    }
  };
  
  // Toggle just music mute
  const handleToggleMusicMute = () => {
    console.log("DIRECT MUTE: Toggling just music mute");
    
    // Get current state
    const currentlyMusicMuted = useAudio.getState().isMusicMuted;
    const newMusicMuteState = !currentlyMusicMuted;
    
    // Update state via direct access
    useAudio.setState({ isMusicMuted: newMusicMuteState });
    
    // Get music elements
    const musicElements = [
      backgroundMusic,
      currentActivityMusic,
      chessMusicOrSimilar,
      fountainMusic,
      seesawMusic
    ].filter(Boolean) as HTMLAudioElement[];
    
    if (newMusicMuteState) {
      // Direct muting of music elements
      musicElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      });
      console.log("DIRECT MUTE: All music muted");
    } else if (!useAudio.getState().isMuted) {
      // Only restore if all audio is not muted
      console.log("DIRECT MUTE: Restoring music");
      
      // Set volumes
      if (backgroundMusic) backgroundMusic.volume = 0.3;
      if (chessMusicOrSimilar) chessMusicOrSimilar.volume = 0.4;
      if (fountainMusic) fountainMusic.volume = 0.4;
      if (seesawMusic) seesawMusic.volume = 0.4;
      
      // Play appropriate track
      if (currentActivityMusic) {
        currentActivityMusic.play().catch(e => console.error("Failed to play activity music:", e));
      } else if (backgroundMusic) {
        backgroundMusic.play().catch(e => console.error("Failed to play background music:", e));
      }
    }
  };
  
  // Force music to be muted on initial load
  useEffect(() => {
    // Make sure music is muted by default when app loads
    console.log("AUDIO CONTROLS: Initial setup");
    
    // Initialize with music muted (using direct approach)
    if (!useAudio.getState().isMusicMuted) {
      handleToggleMusicMute();
    }
  }, []);
  
  // Helper function to determine which activity music is playing
  const getCurrentMusicType = () => {
    // Use the currentTrack from the store directly
    const currentTrack = useAudio.getState().currentTrack;
    let trackName = "";
    
    switch (currentTrack) {
      case "background":
        trackName = "Background";
        break;
      case "chess":
        trackName = "Game Music";
        break;
      case "fountain":
        trackName = "Fountain";
        break;
      case "seesaw":
        trackName = "Playground";
        break;
      default:
        trackName = "Playing...";
    }
    
    console.log(`AUDIO DEBUG: Current track is "${currentTrack}" (${trackName})`);
    return trackName;
  };

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="absolute top-5 right-5 z-50 flex flex-col gap-2">
      {/* Panel toggle button */}
      <button 
        onClick={togglePanel}
        className="bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-80 transition-all self-end"
        aria-label={isExpanded ? "Close audio controls" : "Open audio controls"}
        title={isExpanded ? "Close audio controls" : "Open audio controls"}
      >
        {isExpanded ? "✕" : "🎚️"}
      </button>
      
      {/* Expanded controls panel */}
      {isExpanded && (
        <div className="bg-black bg-opacity-80 p-4 rounded-lg shadow-lg flex flex-col gap-3 min-w-[180px] border border-gray-700">
          <h3 className="text-white font-bold text-center border-b border-gray-600 pb-2">Audio Controls</h3>
          
          {/* Main audio controls */}
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">All Sounds:</span>
            <button 
              onClick={handleToggleMute} 
              className={`text-white p-2 rounded-full ${isMuted ? 'bg-red-700' : 'bg-green-700'} hover:opacity-90 transition-all`}
              aria-label={isMuted ? "Unmute All" : "Mute All"}
              title={isMuted ? "Unmute All" : "Mute All"}
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
          </div>
          
          {/* Music-specific controls */}
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Music:</span>
            <button 
              onClick={handleToggleMusicMute} 
              className={`text-white p-2 rounded-full ${isMusicMuted ? 'bg-red-700' : 'bg-green-700'} hover:opacity-90 transition-all`}
              aria-label={isMusicMuted ? "Unmute Music" : "Mute Music"}
              title={isMusicMuted ? "Unmute Music" : "Mute Music"}
            >
              {isMusicMuted ? "🎵 ✕" : "🎵 ✓"}
            </button>
          </div>
          
          {/* Current music indicator */}
          <div className="text-gray-300 text-xs border-t border-gray-600 pt-2 mt-2">
            <p className="mb-1">Current Music:</p>
            <p className={`font-bold ${!isMuted && !isMusicMuted ? 'text-green-400' : 'text-red-400'}`}>
              {isMuted || isMusicMuted ? 'Muted' : getCurrentMusicType()}
            </p>
          </div>
          
          {/* Information */}
          <div className="text-gray-300 text-xs mt-2">
            <p className="mb-1">Music changes with:</p>
            <ul className="list-disc pl-4 text-xs">
              <li>Games (TicTacToe, etc)</li>
              <li>Fountain</li>
              <li>Seesaw</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Simple indicator when not expanded */}
      {!isExpanded && (
        <div className="bg-black bg-opacity-70 text-white py-1 px-2 rounded text-xs whitespace-nowrap">
          {isMuted ? '🔇 All muted' : (isMusicMuted ? '🔊 SFX only' : '🎵 Music: ' + getCurrentMusicType())}
        </div>
      )}
    </div>
  );
};

export default AudioControls;