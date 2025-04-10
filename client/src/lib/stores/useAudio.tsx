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
  
  // Audio control states
  isMuted: boolean;
  isMusicMuted: boolean;  // Music can be muted separately from sound effects
  
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
  
  // Audio states
  isMuted: false,
  isMusicMuted: false,
  
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
    const { 
      isMusicMuted, 
      backgroundMusic, 
      currentActivityMusic, 
      basketballMusic,
      chessMusicOrSimilar,
      fountainMusic,
      seesawMusic,
      isMuted 
    } = get();
    
    const newMusicMutedState = !isMusicMuted;
    
    // Debug output to help diagnose music muting issues
    console.log(`AUDIO DEBUG: Toggling music mute from ${isMusicMuted} to ${newMusicMutedState}`);
    
    // Update state
    set({ isMusicMuted: newMusicMutedState });
    
    // Force complete stopping of all music elements
    if (newMusicMutedState) {
      // Forcefully stop all music
      const allMusic = [
        backgroundMusic, 
        currentActivityMusic, 
        basketballMusic, 
        chessMusicOrSimilar, 
        fountainMusic, 
        seesawMusic
      ];
      
      allMusic.forEach(audio => {
        if (audio) {
          try {
            // Simple approach - pause and reset
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
            console.log(`AUDIO DEBUG: Paused and muted a music track`);
          } catch (e) {
            console.error("Error while trying to mute music:", e);
          }
        }
      });
      
      console.log("All music muted");
    } else if (!isMuted) {
      // Only unmute and restore volume if sound is not fully muted
      console.log(`AUDIO DEBUG: Attempting to restore music (isMuted=${isMuted})`);
      
      if (backgroundMusic) {
        backgroundMusic.volume = 0.3;
        console.log(`AUDIO DEBUG: Restored background music volume to 0.3`);
      }
      if (basketballMusic) basketballMusic.volume = 0.4;
      if (chessMusicOrSimilar) chessMusicOrSimilar.volume = 0.4;
      if (fountainMusic) fountainMusic.volume = 0.4;
      if (seesawMusic) seesawMusic.volume = 0.4;
      
      // Play the appropriate track
      if (currentActivityMusic) {
        currentActivityMusic.play().catch(error => {
          console.log("Activity music play prevented:", error);
        });
        console.log(`AUDIO DEBUG: Playing current activity music`);
      } else if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
        console.log(`AUDIO DEBUG: Playing background music`);
      }
    } else {
      console.log(`AUDIO DEBUG: Not playing music because isMuted=${isMuted}`);
    }
    
    console.log(`Music ${newMusicMutedState ? 'muted' : 'unmuted'}`);
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
    
    console.log(`AUDIO DEBUG: Attempting to play ${activityType} music (muted=${isMuted}, musicMuted=${isMusicMuted})`);
    
    // If already playing activity music, stop it first
    if (currentActivityMusic) {
      console.log("AUDIO DEBUG: Stopping currently playing activity music");
      currentActivityMusic.pause();
      currentActivityMusic.currentTime = 0;
    }
    
    // Pause background music
    if (backgroundMusic) {
      console.log("AUDIO DEBUG: Pausing background music");
      backgroundMusic.pause();
    }
    
    // Select the appropriate activity music
    let activityMusic = null;
    switch (activityType) {
      case "basketball":
        activityMusic = basketballMusic;
        console.log("AUDIO DEBUG: Selected basketball music");
        break;
      case "ticTacToe":
      case "checkers":
      case "hangman":
        activityMusic = chessMusicOrSimilar;
        console.log("AUDIO DEBUG: Selected chess/board game music");
        break;
      case "fountain":
        activityMusic = fountainMusic;
        console.log("AUDIO DEBUG: Selected fountain music");
        break;
      case "seesaw":
        activityMusic = seesawMusic;
        console.log("AUDIO DEBUG: Selected seesaw music");
        break;
      default:
        console.log(`AUDIO DEBUG: No music found for activity type "${activityType}"`);
    }
    
    // Set as current activity music and track type
    let trackType: MusicTrack = "background";
    
    if (activityType === "ticTacToe" || activityType === "checkers" || activityType === "hangman") {
      trackType = "chess";
    } else if (activityType === "fountain") {
      trackType = "fountain";
    } else if (activityType === "seesaw") {
      trackType = "seesaw";
    }
    
    set({ 
      currentActivityMusic: activityMusic,
      currentTrack: trackType 
    });
    
    // Play the activity music if not muted
    if (activityMusic && !isMuted && !isMusicMuted) {
      console.log("AUDIO DEBUG: Playing activity music");
      activityMusic.currentTime = 0;
      activityMusic.volume = 0.4;
      activityMusic.play().catch(error => {
        console.log(`AUDIO DEBUG: Activity music play prevented for ${activityType}:`, error);
      });
    } else {
      if (!activityMusic) {
        console.log(`AUDIO DEBUG: Activity music for ${activityType} is not loaded`);
      } else if (isMuted) {
        console.log("AUDIO DEBUG: All sound is muted, not playing activity music");
      } else if (isMusicMuted) {
        console.log("AUDIO DEBUG: Music is muted, not playing activity music");
      }
    }
    
    console.log(`Playing ${activityType} music`);
  },
  
  stopActivityMusic: () => {
    const { currentActivityMusic, backgroundMusic, isMuted, isMusicMuted } = get();
    
    // Stop current activity music if playing
    if (currentActivityMusic) {
      console.log("AUDIO DEBUG: Stopping current activity music");
      currentActivityMusic.pause();
      currentActivityMusic.currentTime = 0;
    }
    
    // Reset to background track
    set({ 
      currentActivityMusic: null,
      currentTrack: "background" 
    });
    
    // Resume background music if not muted
    if (backgroundMusic && !isMuted && !isMusicMuted) {
      console.log("AUDIO DEBUG: Resuming background music");
      backgroundMusic.currentTime = 0;
      backgroundMusic.volume = 0.3;
      backgroundMusic.play().catch(error => {
        console.log("Background music resume prevented:", error);
      });
    } else {
      console.log(`AUDIO DEBUG: Not resuming background music (isMuted=${isMuted}, isMusicMuted=${isMusicMuted})`);
    }
    
    console.log("Stopped activity music, resuming background music");
  }
}));
