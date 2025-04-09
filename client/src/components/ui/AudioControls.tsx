import React from 'react';
import { useAudio } from '../../lib/stores/useAudio';

const AudioControls: React.FC = () => {
  const { 
    isMuted, 
    isMusicMuted, 
    toggleMute, 
    toggleMusicMute,
    currentActivityMusic
  } = useAudio();

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
        disabled={isMuted}
      >
        {isMusicMuted ? "🎵 ✕" : "🎵 ✓"}
      </button>
      
      {/* Show current music if playing */}
      {currentActivityMusic && !isMuted && !isMusicMuted && (
        <div className="bg-black bg-opacity-50 text-white p-2 rounded text-xs animate-pulse">
          🎵 Playing...
        </div>
      )}
    </div>
  );
};

export default AudioControls;