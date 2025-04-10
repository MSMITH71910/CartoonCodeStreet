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
        console.log(`AUDIO CONTROL: Switching to game music for ${type} mini-game`);
        // Get the audio store to play chess music for mini-games
        const audioStore = useAudio.getState();
        
        // EXPLICITLY CALL playActivityMusic directly with chess music type
        if (!audioStore.isMuted && !audioStore.isMusicMuted) {
          console.log("AUDIO CONTROL: Directly playing chess music for mini-game");
          
          // First stop any current music
          if (audioStore.currentActivityMusic) {
            console.log("AUDIO CONTROL: Stopping current activity music");
            audioStore.currentActivityMusic.pause();
            audioStore.currentActivityMusic.currentTime = 0;
          }
          
          if (audioStore.backgroundMusic) {
            console.log("AUDIO CONTROL: Stopping background music");
            audioStore.backgroundMusic.pause();
          }
          
          // Use the chess music
          if (audioStore.chessMusicOrSimilar) {
            // Set it as current and start playing
            console.log("AUDIO CONTROL: Playing chess music specifically for mini-game");
            audioStore.chessMusicOrSimilar.currentTime = 0;
            audioStore.chessMusicOrSimilar.volume = 0.4;
            
            // Update the state
            useAudio.setState({
              currentActivityMusic: audioStore.chessMusicOrSimilar,
              currentTrack: "chess"
            });
            
            // Start playing
            audioStore.chessMusicOrSimilar.play().catch(e => 
              console.error("AUDIO ERROR: Failed to play chess music for mini-game:", e)
            );
          } else {
            console.error("AUDIO ERROR: Chess music not available for mini-game");
          }
        } else {
          console.log("AUDIO CONTROL: Audio is muted, not playing chess music for mini-game");
        }
        break;
        
      case "seesaw":
        console.log("AUDIO CONTROL: Switching to seesaw music");
        const seesawAudioStore = useAudio.getState();
        
        // Perform direct music switching using the same pattern as mini-games
        if (!seesawAudioStore.isMuted && !seesawAudioStore.isMusicMuted) {
          console.log("AUDIO CONTROL: Directly playing seesaw music");
          
          // First stop any current music
          if (seesawAudioStore.currentActivityMusic) {
            console.log("AUDIO CONTROL: Stopping current activity music");
            seesawAudioStore.currentActivityMusic.pause();
            seesawAudioStore.currentActivityMusic.currentTime = 0;
          }
          
          if (seesawAudioStore.backgroundMusic) {
            console.log("AUDIO CONTROL: Stopping background music");
            seesawAudioStore.backgroundMusic.pause();
          }
          
          // Use the seesaw music
          if (seesawAudioStore.seesawMusic) {
            // Set it as current and start playing
            console.log("AUDIO CONTROL: Playing seesaw music specifically");
            seesawAudioStore.seesawMusic.currentTime = 0;
            seesawAudioStore.seesawMusic.volume = 0.4;
            
            // Update the state
            useAudio.setState({
              currentActivityMusic: seesawAudioStore.seesawMusic,
              currentTrack: "seesaw"
            });
            
            // Start playing
            seesawAudioStore.seesawMusic.play().catch(e => 
              console.error("AUDIO ERROR: Failed to play seesaw music:", e)
            );
          } else {
            console.error("AUDIO ERROR: Seesaw music not available");
          }
        } else {
          console.log("AUDIO CONTROL: Audio is muted, not playing seesaw music");
        }
        break;
        
      case "fountain":
        console.log("AUDIO CONTROL: Switching to fountain music");
        const fountainAudioStore = useAudio.getState();
        
        // Perform direct music switching using the same pattern as mini-games
        if (!fountainAudioStore.isMuted && !fountainAudioStore.isMusicMuted) {
          console.log("AUDIO CONTROL: Directly playing fountain music");
          
          // First stop any current music
          if (fountainAudioStore.currentActivityMusic) {
            console.log("AUDIO CONTROL: Stopping current activity music");
            fountainAudioStore.currentActivityMusic.pause();
            fountainAudioStore.currentActivityMusic.currentTime = 0;
          }
          
          if (fountainAudioStore.backgroundMusic) {
            console.log("AUDIO CONTROL: Stopping background music");
            fountainAudioStore.backgroundMusic.pause();
          }
          
          // Use the fountain music
          if (fountainAudioStore.fountainMusic) {
            // Set it as current and start playing
            console.log("AUDIO CONTROL: Playing fountain music specifically");
            fountainAudioStore.fountainMusic.currentTime = 0;
            fountainAudioStore.fountainMusic.volume = 0.4;
            
            // Update the state
            useAudio.setState({
              currentActivityMusic: fountainAudioStore.fountainMusic,
              currentTrack: "fountain"
            });
            
            // Start playing
            fountainAudioStore.fountainMusic.play().catch(e => 
              console.error("AUDIO ERROR: Failed to play fountain music:", e)
            );
          } else {
            console.error("AUDIO ERROR: Fountain music not available");
          }
        } else {
          console.log("AUDIO CONTROL: Audio is muted, not playing fountain music");
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