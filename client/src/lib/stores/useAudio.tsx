import { create } from "zustand";

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
    const { isMuted, backgroundMusic, currentActivityMusic } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state
    set({ isMuted: newMutedState });
    
    // Handle all currently playing music
    if (newMutedState) {
      // Muting - pause all audio
      if (backgroundMusic) backgroundMusic.pause();
      if (currentActivityMusic) currentActivityMusic.pause();
    } else {
      // Unmuting - play appropriate music if music is not separately muted
      if (!get().isMusicMuted) {
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
      }
    }
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  // Toggle just music (sound effects still play)
  toggleMusicMute: () => {
    const { isMusicMuted, backgroundMusic, currentActivityMusic, isMuted } = get();
    const newMusicMutedState = !isMusicMuted;
    
    // Update state
    set({ isMusicMuted: newMusicMutedState });
    
    // Always handle music toggle, regardless of isMuted state
    if (newMusicMutedState) {
      // Music muting - pause all music
      if (backgroundMusic) backgroundMusic.pause();
      if (currentActivityMusic) currentActivityMusic.pause();
    } else if (!isMuted) {
      // Music unmuting (only if sound is not fully muted) - play appropriate music
      if (currentActivityMusic) {
        currentActivityMusic.play().catch(error => {
          console.log("Activity music play prevented:", error);
        });
      } else if (backgroundMusic) {
        backgroundMusic.play().catch(error => {
          console.log("Background music play prevented:", error);
        });
      }
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
    
    // If already playing activity music, stop it first
    if (currentActivityMusic) {
      currentActivityMusic.pause();
      currentActivityMusic.currentTime = 0;
    }
    
    // Pause background music
    if (backgroundMusic) {
      backgroundMusic.pause();
    }
    
    // Select the appropriate activity music
    let activityMusic = null;
    switch (activityType) {
      case "basketball":
        activityMusic = basketballMusic;
        break;
      case "ticTacToe":
      case "checkers":
      case "hangman":
        activityMusic = chessMusicOrSimilar;
        break;
      case "fountain":
        activityMusic = fountainMusic;
        break;
      case "seesaw":
        activityMusic = seesawMusic;
        break;
    }
    
    // Set as current activity music
    set({ currentActivityMusic: activityMusic });
    
    // Play the activity music if not muted
    if (activityMusic && !isMuted && !isMusicMuted) {
      activityMusic.currentTime = 0;
      activityMusic.play().catch(error => {
        console.log(`Activity music play prevented for ${activityType}:`, error);
      });
    }
    
    console.log(`Playing ${activityType} music`);
  },
  
  stopActivityMusic: () => {
    const { currentActivityMusic, backgroundMusic, isMuted, isMusicMuted } = get();
    
    // Stop current activity music if playing
    if (currentActivityMusic) {
      currentActivityMusic.pause();
      currentActivityMusic.currentTime = 0;
      set({ currentActivityMusic: null });
    }
    
    // Resume background music if not muted
    if (backgroundMusic && !isMuted && !isMusicMuted) {
      backgroundMusic.play().catch(error => {
        console.log("Background music resume prevented:", error);
      });
    }
    
    console.log("Stopped activity music, resuming background music");
  }
}));
