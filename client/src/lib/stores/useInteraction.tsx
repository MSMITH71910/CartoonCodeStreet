import { create } from "zustand";
import * as THREE from "three";
import { RefObject } from "react";
import { useAudio } from "./useAudio"; // Import audio store

export type InteractionType = 
  | "none" 
  | "seesaw" 
  | "ticTacToe" 
  | "hangman" 
  | "checkers" 
  | "lamp"
  | "fountain";

export type GameState = {
  ticTacToe?: {
    board: Array<string | null>;
    currentPlayer: "X" | "O";
    winner: string | null;
  };
  hangman?: {
    word: string;
    guessed: string[];
    attempts: number;
    maxAttempts: number;
  };
  checkers?: {
    board: number[][];
    currentPlayer: 1 | 2;
    selectedPiece: [number, number] | null;
  };
};

interface InteractionState {
  // Current interaction status
  interactionType: InteractionType;
  interactingWithId: string | null;
  interactionPosition: THREE.Vector3 | null;
  interactionRotation: number | null;
  gameState: GameState;
  showGameUI: boolean;
  
  // Character state tracking
  isSitting: boolean;
  isOnSeesaw: boolean;
  
  // Methods
  startInteraction: (type: InteractionType, objectId: string, position: THREE.Vector3, rotation: number) => void;
  endInteraction: () => void;
  updateGameState: (newState: Partial<GameState>) => void;
  toggleGameUI: () => void;
}

export const useInteraction = create<InteractionState>((set, get) => ({
  interactionType: "none",
  interactingWithId: null,
  interactionPosition: null,
  interactionRotation: null,
  gameState: {},
  showGameUI: false,
  isSitting: false,
  isOnSeesaw: false,
  
  startInteraction: (type, objectId, position, rotation) => {
    console.log(`INTERACTION: Starting interaction with ${type} (object ${objectId})`);
    
    // End any existing interaction first
    if (get().interactionType !== "none") {
      console.log(`INTERACTION: Ending previous interaction (${get().interactionType}) before starting new one`);
      get().endInteraction();
    }
    
    // Setup special states based on interaction type
    let isSitting = false;
    let isOnSeesaw = false;
    
    if (type === "seesaw") {
      isOnSeesaw = true;
    }
    
    // CRITICAL: We'll play the mini-game music when we update state
    // No need to do it here as we already have code that handles it later
    
    // Initialize appropriate game state based on interaction type
    let gameState: GameState = {};
    let showGameUI = false;
    
    switch (type) {
      case "ticTacToe":
        console.log("INTERACTION: Initializing TicTacToe game");
        gameState.ticTacToe = {
          board: Array(9).fill(null),
          currentPlayer: "X",
          winner: null
        };
        showGameUI = true;
        break;
        
      case "hangman":
        console.log("INTERACTION: Initializing Hangman game");
        const words = ["JAVASCRIPT", "REACT", "THREE", "PORTFOLIO", "DEVELOPER"];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        gameState.hangman = {
          word: randomWord,
          guessed: [],
          attempts: 0,
          maxAttempts: 6
        };
        showGameUI = true;
        break;
        
      case "checkers":
        console.log("INTERACTION: Initializing Checkers game");
        // Initialize checkers board (0 = empty, 1 = player 1, 2 = player 2)
        const board = Array(8).fill(0).map(() => Array(8).fill(0));
        
        // Set up pieces
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
              board[row][col] = 2; // Player 2 pieces at top
            }
          }
        }
        
        for (let row = 5; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
              board[row][col] = 1; // Player 1 pieces at bottom
            }
          }
        }
        
        gameState.checkers = {
          board,
          currentPlayer: 1,
          selectedPiece: null
        };
        showGameUI = true;
        break;
    }
    
    // Update interaction state
    set({
      interactionType: type,
      interactingWithId: objectId,
      interactionPosition: position,
      interactionRotation: rotation,
      isSitting,
      isOnSeesaw,
      gameState,
      showGameUI
    });
    
    // IMPORTANT: Play the appropriate activity music AFTER state is updated
    // This allows the audio system to properly detect what type of interaction is happening
    switch (type) {
      case "ticTacToe":
      case "hangman":
      case "checkers":
        console.log(`AUDIO CONTROL: Switching to game music for ${type} mini-game`);
        
        // Use the audio store directly
        const audioStore = useAudio.getState();
        
        // SIMPLIFIED AUDIO: Just pause background music for mini-games
        if (audioStore.backgroundMusic) {
          console.log(`AUDIO CONTROL: Simply pausing background music for ${type} mini-game`);
          audioStore.backgroundMusic.pause();
        }
        
        // Update state to indicate we're in a mini-game
        useAudio.setState({
          currentActivityMusic: null,
          currentTrack: "chess" // Just for state tracking
        });
        break;
        
      case "seesaw":
        console.log("AUDIO CONTROL: Switching to seesaw interaction");
        const seesawAudioStore = useAudio.getState();
        
        // SIMPLIFIED AUDIO: Just pause background music for seesaw
        if (seesawAudioStore.backgroundMusic) {
          console.log("AUDIO CONTROL: Simply pausing background music for seesaw");
          seesawAudioStore.backgroundMusic.pause();
        }
        
        // Update state to indicate we're in an activity
        useAudio.setState({
          currentActivityMusic: null,
          currentTrack: "seesaw" // Just for state tracking
        });
        break;
        
      case "fountain":
        console.log("AUDIO CONTROL: Switching to fountain interaction");
        const fountainAudioStore = useAudio.getState();
        
        // SIMPLIFIED AUDIO: Just pause background music for fountain
        if (fountainAudioStore.backgroundMusic) {
          console.log("AUDIO CONTROL: Simply pausing background music for fountain");
          fountainAudioStore.backgroundMusic.pause();
        }
        
        // Update state to indicate we're in an activity
        useAudio.setState({
          currentActivityMusic: null,
          currentTrack: "fountain" // Just for state tracking
        });
        break;
    }
    
    console.log(`INTERACTION: Started ${type} interaction with object ${objectId}`);
  },
  
  endInteraction: () => {
    console.log("INTERACTION: Ending current interaction");
    
    // Get current interaction type before clearing it
    const currentType = get().interactionType;
    
    // First reset the interaction state
    set({
      interactionType: "none",
      interactingWithId: null,
      interactionPosition: null,
      interactionRotation: null,
      isSitting: false,
      isOnSeesaw: false,
      showGameUI: false
    });
    
    // Only switch audio if we were in an active interaction
    if (currentType !== "none") {
      console.log(`INTERACTION: Ending interaction of type ${currentType}`);
      
      // Get the audio store
      const audioStore = useAudio.getState();
      
      // First stop any activity music
      if (audioStore.currentActivityMusic) {
        console.log("AUDIO CONTROL: Stopping current activity music");
        audioStore.currentActivityMusic.pause();
        audioStore.currentActivityMusic.currentTime = 0;
        // Reset playback rate to normal
        audioStore.currentActivityMusic.playbackRate = 1.0;
      }
      
      // Previously tried to use Web Audio API - now simplified
      
      // Reset to background music
      useAudio.setState({
        currentActivityMusic: null,
        currentTrack: "background"
      });
      
      // Play background music if not muted
      if (audioStore.backgroundMusic && !audioStore.isMuted && !audioStore.isMusicMuted) {
        console.log("AUDIO CONTROL: Resuming background music");
        audioStore.backgroundMusic.currentTime = 0;
        audioStore.backgroundMusic.volume = 0.3;
        try {
          audioStore.backgroundMusic.play();
        } catch (e) {
          console.error("AUDIO ERROR: Failed to resume background music:", e);
        }
      } else {
        console.log("AUDIO CONTROL: Background music not resumed because audio is muted");
      }
    }
    
    console.log("INTERACTION: Interaction ended completely");
  },
  
  updateGameState: (newState) => {
    set((state) => ({
      gameState: { ...state.gameState, ...newState }
    }));
  },
  
  toggleGameUI: () => {
    set((state) => ({
      showGameUI: !state.showGameUI
    }));
  }
}));