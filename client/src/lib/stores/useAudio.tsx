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
  
  setHitSound: (sound) => set({ hitSound: sound }),
  
  setSuccessSound: (sound) => set({ successSound: sound }),
  
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
  
  // Activity music control
  playActivityMusic: (activityType) => {
    const { 
      isMuted, 
      isMusicMuted, 
      backgroundMusic, 
      currentActivityMusic,
      basketballMusic,
      chessMusicOrSimilar,
      fountainMusic,
      seesawMusic
    } = get();
    
    // If all audio or music is muted, don't play anything
    if (isMuted || isMusicMuted) {
      return;
    }
    
    // First pause any currently playing tracks
    if (currentActivityMusic) {
      currentActivityMusic.pause();
      currentActivityMusic.currentTime = 0;
    }
    
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
    
    // Select the appropriate track and track type
    let activityMusic: HTMLAudioElement | null = null;
    let trackType: MusicTrack = "background";
    
    switch (activityType.toLowerCase()) {
      case "basketball":
        if (basketballMusic) {
          activityMusic = basketballMusic;
          trackType = "chess"; // Use chess track type for basketball
        }
        break;
        
      // Add ALL variations of case for mini-games to match any format
      case "tictactoe":
      case "tic-tac-toe":
      case "tic tac toe":
      case "checkers":
      case "hangman":
      case "chess":
      case "boardgame":
      case "board-game":
      case "chessmusicorsimilar": // Direct store key
        if (chessMusicOrSimilar) {
          activityMusic = chessMusicOrSimilar;
          trackType = "chess";
        }
        break;
        
      case "fountain":
        if (fountainMusic) {
          activityMusic = fountainMusic;
          trackType = "fountain";
        }
        break;
        
      case "seesaw":
        if (seesawMusic) {
          activityMusic = seesawMusic;
          trackType = "seesaw";
        }
        break;
        
      case "background":
        trackType = "background";
        break;
    }
    
    // Update the current track type and activity music
    if (activityMusic) {
      set({ 
        currentActivityMusic: activityMusic,
        currentTrack: trackType 
      });
      
      // Play the selected activity music
      activityMusic.currentTime = 0;
      activityMusic.volume = 0.4;
      activityMusic.play().catch(() => {
        // Silent error handling
      });
    } 
    else if (activityType === "background" && backgroundMusic) {
      // Special case for background music
      set({ 
        currentActivityMusic: null,
        currentTrack: "background" 
      });
      
      // Play background music
      backgroundMusic.currentTime = 0;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(() => {
        // Silent error handling
      });
    }
  },
  
  stopActivityMusic: () => {
    const { currentActivityMusic, backgroundMusic, isMuted, isMusicMuted } = get();
    
    // First stop any active music
    if (currentActivityMusic) {
      currentActivityMusic.pause();
      currentActivityMusic.currentTime = 0;
    }
    
    // Reset state to background track
    set({ 
      currentActivityMusic: null,
      currentTrack: "background" 
    });
    
    // Resume background music if not muted
    if (backgroundMusic && !isMuted && !isMusicMuted) {
      backgroundMusic.currentTime = 0;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(() => {
        // Silent error handling
      });
    }
  }
}));
