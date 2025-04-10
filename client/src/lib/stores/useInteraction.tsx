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
        console.log(`AUDIO CONTROL: Switching to game music for ${type}`);
        // Get a direct reference to the audio store to ensure we're calling the latest version
        const audioStore = useAudio.getState();
        if (audioStore.chessMusicOrSimilar) {
          // First pause any currently playing music
          if (audioStore.currentActivityMusic) {
            audioStore.currentActivityMusic.pause();
          }
          if (audioStore.backgroundMusic) {
            audioStore.backgroundMusic.pause();
          }
          
          // Set new current activity music and track
          useAudio.setState({
            currentActivityMusic: audioStore.chessMusicOrSimilar,
            currentTrack: "chess"
          });
          
          // Play if not muted
          if (!audioStore.isMuted && !audioStore.isMusicMuted) {
            audioStore.chessMusicOrSimilar.currentTime = 0;
            audioStore.chessMusicOrSimilar.play().catch(e => console.error("Failed to play game music:", e));
            console.log("AUDIO CONTROL: Now playing game music");
          } else {
            console.log("AUDIO CONTROL: Game music not played because audio is muted");
          }
        }
        break;
        
      case "seesaw":
        console.log("AUDIO CONTROL: Switching to seesaw music");
        const seesawAudioStore = useAudio.getState();
        if (seesawAudioStore.seesawMusic) {
          // First pause any currently playing music
          if (seesawAudioStore.currentActivityMusic) {
            seesawAudioStore.currentActivityMusic.pause();
          }
          if (seesawAudioStore.backgroundMusic) {
            seesawAudioStore.backgroundMusic.pause();
          }
          
          // Set new current activity music and track
          useAudio.setState({
            currentActivityMusic: seesawAudioStore.seesawMusic,
            currentTrack: "seesaw"
          });
          
          // Play if not muted
          if (!seesawAudioStore.isMuted && !seesawAudioStore.isMusicMuted) {
            seesawAudioStore.seesawMusic.currentTime = 0;
            seesawAudioStore.seesawMusic.play().catch(e => console.error("Failed to play seesaw music:", e));
            console.log("AUDIO CONTROL: Now playing seesaw music");
          } else {
            console.log("AUDIO CONTROL: Seesaw music not played because audio is muted");
          }
        }
        break;
        
      case "fountain":
        console.log("AUDIO CONTROL: Switching to fountain music");
        const fountainAudioStore = useAudio.getState();
        if (fountainAudioStore.fountainMusic) {
          // First pause any currently playing music
          if (fountainAudioStore.currentActivityMusic) {
            fountainAudioStore.currentActivityMusic.pause();
          }
          if (fountainAudioStore.backgroundMusic) {
            fountainAudioStore.backgroundMusic.pause();
          }
          
          // Set new current activity music and track
          useAudio.setState({
            currentActivityMusic: fountainAudioStore.fountainMusic,
            currentTrack: "fountain"
          });
          
          // Play if not muted
          if (!fountainAudioStore.isMuted && !fountainAudioStore.isMusicMuted) {
            fountainAudioStore.fountainMusic.currentTime = 0;
            fountainAudioStore.fountainMusic.play().catch(e => console.error("Failed to play fountain music:", e));
            console.log("AUDIO CONTROL: Now playing fountain music");
          } else {
            console.log("AUDIO CONTROL: Fountain music not played because audio is muted");
          }
        }
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
      
      // Get the current audio state
      const audioStore = useAudio.getState();
      
      // First stop any activity music
      if (audioStore.currentActivityMusic) {
        console.log("AUDIO CONTROL: Stopping current activity music");
        audioStore.currentActivityMusic.pause();
        audioStore.currentActivityMusic.currentTime = 0;
      }
      
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
        audioStore.backgroundMusic.play().catch(e => console.error("Failed to resume background music:", e));
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