import React from 'react';
import { useAudio } from '../../lib/stores/useAudio';

const AudioControls: React.FC = () => {
  const { 
    isMuted, 
    isMusicMuted, 
    toggleMute, 
    toggleMusicMute,
    currentActivityMusic,
    basketballMusic,
    chessMusicOrSimilar,
    fountainMusic,
    seesawMusic
  } = useAudio();
  
  // Helper function to determine which activity music is playing
  const getCurrentMusicType = () => {
    if (!currentActivityMusic) return "Background";
    
    if (currentActivityMusic === basketballMusic) return "Basketball";
    if (currentActivityMusic === chessMusicOrSimilar) return "Game Music";
    if (currentActivityMusic === fountainMusic) return "Fountain";
    if (currentActivityMusic === seesawMusic) return "Playground";
    
    return "Playing...";
  };

  return (
    <div className="absolute top-5 right-5 z-50 flex flex-col gap-2">
      {/* Main audio controls */}
      <button 
        onClick={toggleMute} 
        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        aria-label={isMuted ? "Unmute All" : "Mute All"}
        title={isMuted ? "Unmute All" : "Mute All"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>
      
      {/* Music-specific controls */}
      <button 
        onClick={toggleMusicMute} 
        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
        aria-label={isMusicMuted ? "Unmute Music" : "Mute Music"}
        title={isMusicMuted ? "Unmute Music" : "Mute Music"}
      >
        {isMusicMuted ? "🎵 ✕" : "🎵 ✓"}
      </button>
      
      {/* Show current music if playing */}
      {currentActivityMusic && !isMuted && !isMusicMuted && (
        <div className="bg-black bg-opacity-50 text-white p-2 rounded text-xs animate-pulse whitespace-nowrap">
          🎵 {getCurrentMusicType()}
        </div>
      )}
      
      {/* Show which control does what */}
      <div className="bg-black bg-opacity-70 text-white p-2 rounded text-xs mt-1 whitespace-nowrap pointer-events-none">
        Click objects to interact
      </div>
    </div>
  );
};

export default AudioControls;