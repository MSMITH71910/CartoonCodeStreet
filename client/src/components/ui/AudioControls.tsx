import React, { useEffect, useState } from 'react';
import { useAudio } from '../../lib/stores/useAudio';

const AudioControls: React.FC = () => {
  const { 
    isMuted, 
    isMusicMuted, 
    toggleMute, 
    toggleMusicMute,
    backgroundMusic,
    currentActivityMusic,
    chessMusicOrSimilar,
    fountainMusic,
    seesawMusic
  } = useAudio();

  // Track expanded state for controls panel
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Force music to be muted on initial load
  useEffect(() => {
    // Make sure music is muted by default when app loads
    if (!isMusicMuted) {
      toggleMusicMute();
    }
  }, []);
  
  // Helper function to determine which activity music is playing
  const getCurrentMusicType = () => {
    if (!currentActivityMusic) return "Background";
    
    if (currentActivityMusic === chessMusicOrSimilar) return "Game Music";
    if (currentActivityMusic === fountainMusic) return "Fountain";
    if (currentActivityMusic === seesawMusic) return "Playground";
    
    return "Playing...";
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
              onClick={toggleMute} 
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
              onClick={toggleMusicMute} 
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