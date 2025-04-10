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
      music.play().catch(error => {
        console.log("Background music play prevented:", error);
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
    
    console.log(`Set activity music for ${activityType}`);
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
    
    // Debug output to help diagnose muting issues
    console.log(`AUDIO DEBUG: Toggling mute from ${isMuted} to ${newMutedState}`);
    
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
            console.log(`AUDIO DEBUG: Paused and muted an audio track`);
          } catch (e) {
            console.error("Error while trying to mute audio:", e);
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
          currentActivityMusic.play().catch(error => {
            console.log("Activity music play prevented:", error);
          });
        } else if (backgroundMusic) {
          backgroundMusic.play().catch(error => {
            console.log("Background music play prevented:", error);
          });
        }
      } else {
        console.log(`AUDIO DEBUG: Not playing music because isMusicMuted=${get().isMusicMuted}`);
      }
    }
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  // Toggle just music (sound effects still play)
  toggleMusicMute: () => {
    console.log("DIRECT MUTE: Toggling just music mute");
    
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
      // MUTING MUSIC
      console.log("DIRECT MUTE: All music muted");
      
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
      // UNMUTING MUSIC (if master mute is not on)
      console.log(`DIRECT MUTE: Unmuting music (current track: ${currentTrack})`);
      
      // Determine which track should be playing based on currentTrack state
      if (currentTrack === "background" && backgroundMusic) {
        // Play background music
        backgroundMusic.volume = 0.3;
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(error => {
          console.error("AUDIO ERROR: Background music play error:", error);
        });
        console.log("DIRECT MUTE: Playing background music");
      } 
      else if (currentActivityMusic) {
        // Play current activity music
        currentActivityMusic.volume = 0.4;
        currentActivityMusic.currentTime = 0;
        currentActivityMusic.play().catch(error => {
          console.error("AUDIO ERROR: Activity music play error:", error);
        });
        console.log(`DIRECT MUTE: Playing ${currentTrack} music`);
      }
    } 
    else {
      console.log("DIRECT MUTE: Master mute is on, not playing any music");
    }
  },
  
  // Play sound effects
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  // Activity music control
  playActivityMusic: (activityType) => {
    console.log(`AUDIO CONTROL: Request to play music for activity: ${activityType}`);
    
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
      console.log("AUDIO CONTROL: Music is muted, not playing activity music");
      return;
    }
    
    // First pause any currently playing tracks
    if (currentActivityMusic) {
      console.log("AUDIO CONTROL: Stopping currently playing activity music");
      currentActivityMusic.pause();
      currentActivityMusic.currentTime = 0;
    }
    
    if (backgroundMusic) {
      console.log("AUDIO CONTROL: Pausing background music");
      backgroundMusic.pause();
    }
    
    // Select the appropriate track and track type
    let activityMusic: HTMLAudioElement | null = null;
    let trackType: MusicTrack = "background";
    
    // Important debug info
    console.log(`AUDIO SWITCH: Checking for music for activity: "${activityType}"`);
    
    switch (activityType.toLowerCase()) {
      case "basketball":
        if (basketballMusic) {
          activityMusic = basketballMusic;
          trackType = "chess"; // Use chess track type for basketball
          console.log("AUDIO CONTROL: Selected basketball music");
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
          console.log("AUDIO CONTROL: Selected chess/board game music for activity: " + activityType);
        } else {
          console.error("AUDIO ERROR: Chess music is null for: " + activityType);
        }
        break;
        
      case "fountain":
        if (fountainMusic) {
          activityMusic = fountainMusic;
          trackType = "fountain";
          console.log("AUDIO CONTROL: Selected fountain music");
        }
        break;
        
      case "seesaw":
        if (seesawMusic) {
          activityMusic = seesawMusic;
          trackType = "seesaw";
          console.log("AUDIO CONTROL: Selected seesaw music");
        }
        break;
        
      case "background":
        trackType = "background";
        console.log("AUDIO CONTROL: Selected background music");
        break;
        
      default:
        console.log(`AUDIO CONTROL: No music found for activity type "${activityType}"`);
    }
    
    // Update the current track type and activity music
    if (activityMusic) {
      set({ 
        currentActivityMusic: activityMusic,
        currentTrack: trackType 
      });
      
      // Play the selected activity music
      console.log(`AUDIO CONTROL: Playing ${activityType} music (track: ${trackType})`);
      activityMusic.currentTime = 0;
      activityMusic.volume = 0.4;
      activityMusic.play().catch(error => {
        console.error(`AUDIO ERROR: Couldn't play ${activityType} music:`, error);
      });
    } 
    else if (activityType === "background" && backgroundMusic) {
      // Special case for background music
      set({ 
        currentActivityMusic: null,
        currentTrack: "background" 
      });
      
      // Play background music
      console.log("AUDIO CONTROL: Playing background music");
      backgroundMusic.currentTime = 0;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(error => {
        console.error("AUDIO ERROR: Couldn't play background music:", error);
      });
    }
    else {
      console.log(`AUDIO CONTROL: No music available for activity type "${activityType}"`);
    }
  },
  
  stopActivityMusic: () => {
    console.log("AUDIO CONTROL: Stop activity music requested - switching to background");
    
    const { currentActivityMusic, backgroundMusic, isMuted, isMusicMuted } = get();
    
    // First stop any active music
    if (currentActivityMusic) {
      console.log("AUDIO CONTROL: Stopping current activity music");
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
      console.log("AUDIO CONTROL: Starting background music");
      backgroundMusic.currentTime = 0;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(error => {
        console.error("AUDIO ERROR: Background music couldn't resume:", error);
      });
    } else {
      if (isMuted) {
        console.log("AUDIO CONTROL: Master mute is on, not playing background music");
      } else if (isMusicMuted) {
        console.log("AUDIO CONTROL: Music mute is on, not playing background music");
      } else if (!backgroundMusic) {
        console.log("AUDIO CONTROL: No background music available");
      }
    }
  }
}));
