import { create } from "zustand";

// Define music tracks
type MusicTrack = "background" | "chess" | "fountain" | "seesaw";

interface AudioState {
  // Main audio tracks
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  
  // Activity-specific music
  basketballMusic: HTMLAudioElement | null;
  chessMusicOrSimilar: HTMLAudioElement | null; 
  fountainMusic: HTMLAudioElement | null;
  seesawMusic: HTMLAudioElement | null;
  
  // Currently playing activity music (if any)
  currentActivityMusic: HTMLAudioElement | null;
  currentTrack: MusicTrack;
  
  // Web Audio API music type for procedural generation
  webAudioType: MusicTrack | null;
  
  // Audio control states
  isMuted: boolean;
  isMusicMuted: boolean;  // Music can be muted separately from sound effects
  
  // Mini-game audio configuration
  chessPlaybackRate: number;
  seesawPlaybackRate: number;
  fountainPlaybackRate: number;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setActivityMusic: (activityType: string, music: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  toggleMusicMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  
  // Activity music functions
  playActivityMusic: (activityType: string) => void;
  stopActivityMusic: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  // Audio elements
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  
  // Activity-specific music
  basketballMusic: null,
  chessMusicOrSimilar: null,
  fountainMusic: null,
  seesawMusic: null,
  
  // Currently playing activity music
  currentActivityMusic: null,
  currentTrack: "background", // Default track
  
  // Web Audio API music type for procedural generation
  webAudioType: "background", // Default to background music
  
  // Audio states
  isMuted: false,
  isMusicMuted: false,
  
  // Mini-game audio configuration (different playback rates make tracks sound different)
  chessPlaybackRate: 1.25,
  seesawPlaybackRate: 1.5,
  fountainPlaybackRate: 0.85,
  
  // Setter functions
  setBackgroundMusic: (music) => {
    // Setup background music properties
    music.loop = true;
    music.volume = 0.3;
    
    // Store the reference
    set({ backgroundMusic: music });
    
    // Auto-play background music if not muted
    if (!get().isMuted && !get().isMusicMuted) {
      music.play().catch(() => {
        // Silent error handling
      });
    }
  },
  
  // Completely disabled sound effects to prevent clicks
  setHitSound: (_sound) => {
    // Don't actually set the sound
    return;
  },
  
  setSuccessSound: (_sound) => {
    // Don't actually set the sound
    return;
  },
  
  setActivityMusic: (activityType, music) => {
    // Setup music properties
    music.loop = true;
    music.volume = 0.4;
    
    // Store in the appropriate slot
    switch (activityType) {
      case "basketball":
        set({ basketballMusic: music });
        break;
      case "ticTacToe":
      case "checkers":
      case "hangman":
        set({ chessMusicOrSimilar: music });
        break;
      case "fountain":
        set({ fountainMusic: music });
        break;
      case "seesaw":
        set({ seesawMusic: music });
        break;
    }
  },
  
  // Toggle all audio
  toggleMute: () => {
    const { 
      isMuted, 
      backgroundMusic, 
      currentActivityMusic,
      basketballMusic,
      chessMusicOrSimilar,
      fountainMusic,
      seesawMusic
    } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Handle all currently playing music
    if (newMutedState) {
      // Muting - forcefully stop ALL audio 
      const allAudio = [
        backgroundMusic, 
        currentActivityMusic,
        basketballMusic,
        chessMusicOrSimilar,
        fountainMusic,
        seesawMusic
      ];
      
      allAudio.forEach(audio => {
        if (audio) {
          try {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
          } catch (e) {
            // Silent error handling
          }
        }
      });

      // Set current activity music to null when muting everything
      set({ currentActivityMusic: null });
    } else {
      // Unmuting - play appropriate music if music is not separately muted
      if (!get().isMusicMuted) {
        // Restore volumes
        if (backgroundMusic) backgroundMusic.volume = 0.3;
        if (basketballMusic) basketballMusic.volume = 0.4;
        if (chessMusicOrSimilar) chessMusicOrSimilar.volume = 0.4;
        if (fountainMusic) fountainMusic.volume = 0.4;
        if (seesawMusic) seesawMusic.volume = 0.4;
        
        // If in an activity, play activity music, otherwise play background music
        if (currentActivityMusic) {
          currentActivityMusic.play().catch(() => {
            // Silent error handling
          });
        } else if (backgroundMusic) {
          backgroundMusic.play().catch(() => {
            // Silent error handling
          });
        }
      }
    }
  },
  
  // Toggle just music (sound effects still play)
  toggleMusicMute: () => {
    const { 
      isMusicMuted, 
      backgroundMusic, 
      currentActivityMusic,
      currentTrack,
      isMuted 
    } = get();
    
    const newMusicMutedState = !isMusicMuted;
    
    // Update state first
    set({ isMusicMuted: newMusicMutedState });
    
    if (newMusicMutedState) {
      // First, stop any currently playing music
      if (currentActivityMusic) {
        currentActivityMusic.pause();
        currentActivityMusic.currentTime = 0;
      }
      
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    } 
    else if (!isMuted) {
      // Determine which track should be playing based on currentTrack state
      if (currentTrack === "background" && backgroundMusic) {
        // Play background music
        backgroundMusic.volume = 0.3;
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(() => {
          // Silent error handling
        });
      } 
      else if (currentActivityMusic) {
        // Play current activity music
        currentActivityMusic.volume = 0.4;
        currentActivityMusic.currentTime = 0;
        currentActivityMusic.play().catch(() => {
          // Silent error handling
        });
      }
    }
  },
  
  // Play sound effects - removed to prevent continuous sounds
  playHit: () => {
    // Disabled to avoid clicking sounds in mini-games
    return;
  },
  
  playSuccess: () => {
    // Disabled to avoid clicking sounds in mini-games
    return;
  },
  
  // Activity music control - completely silenced
  playActivityMusic: (activityType) => {
    // Avoid any potential clicking sounds by not playing any new audio
    // Just track the current track type for state management
    try {
      const { 
        isMuted, 
        isMusicMuted, 
        backgroundMusic, 
        currentActivityMusic
      } = get();
      
      // If all audio or music is muted, don't do anything
      if (isMuted || isMusicMuted) {
        return;
      }
      
      // First pause any currently playing tracks silently
      if (currentActivityMusic) {
        currentActivityMusic.pause();
        currentActivityMusic.currentTime = 0;
      }
      
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
      
      // Only update track type state but don't play any sound
      let trackType: MusicTrack = "background";
      
      switch (activityType.toLowerCase()) {
        case "basketball":
        case "tictactoe":
        case "tic-tac-toe":
        case "tic tac toe":
        case "checkers":
        case "hangman":
        case "chess":
        case "boardgame":
        case "board-game":
        case "chessmusicorsimilar":
          trackType = "chess";
          break;
          
        case "fountain":
          trackType = "fountain";
          break;
          
        case "seesaw":
          trackType = "seesaw";
          break;
          
        case "background":
        default:
          trackType = "background";
          break;
      }
      
      // Only update state - no audio playing to avoid clicking sounds
      set({ 
        currentActivityMusic: null,
        currentTrack: trackType 
      });
    } catch (e) {
      // Silent error handling - no alerts or logging
    }
  },
  
  stopActivityMusic: () => {
    // Implement with safety checks to prevent any clicking sounds
    try {
      const { currentActivityMusic, backgroundMusic, isMuted, isMusicMuted } = get();
      
      // First stop any active music silently
      if (currentActivityMusic) {
        currentActivityMusic.pause();
        currentActivityMusic.currentTime = 0;
      }
      
      // Reset state to background track
      set({ 
        currentActivityMusic: null,
        currentTrack: "background" 
      });
      
      // Resume background music if not muted, with fade-in to prevent clicks
      if (backgroundMusic && !isMuted && !isMusicMuted) {
        backgroundMusic.currentTime = 0;
        // Start with very low volume to avoid clicks
        backgroundMusic.volume = 0.01; 
        
        try {
          backgroundMusic.play()
            .then(() => {
              // Gradually increase volume for smooth transition
              setTimeout(() => {
                if (backgroundMusic) {
                  backgroundMusic.volume = 0.3;
                }
              }, 300);
            })
            .catch(() => {
              // Silent error handling
            });
        } catch (e) {
          // Silent error handling
        }
      }
    } catch (e) {
      // Silent error handling
    }
  }
}));
