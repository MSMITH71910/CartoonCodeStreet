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
  | "lamp";

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
    // End any existing interaction
    if (get().interactionType !== "none") {
      get().endInteraction();
    }
    
    // Setup special interaction states
    let isSitting = false; // "sitting" type removed
    let isOnSeesaw = false;
    
    if (type === "seesaw") {
      isOnSeesaw = true;
    }
    
    // Initialize appropriate game state based on interaction type
    let gameState: GameState = {};
    let showGameUI = false;
    
    // Play the appropriate activity music
    switch (type) {
      case "ticTacToe":
        gameState.ticTacToe = {
          board: Array(9).fill(null),
          currentPlayer: "X",
          winner: null
        };
        showGameUI = true;
        // Play board game music
        useAudio.getState().playActivityMusic("ticTacToe");
        console.log("AUDIO DEBUG: Playing tic-tac-toe music");
        break;
        
      case "hangman":
        const words = ["JAVASCRIPT", "REACT", "THREE", "PORTFOLIO", "DEVELOPER"];
        const randomWord = words[Math.floor(Math.random() * words.length)];
        gameState.hangman = {
          word: randomWord,
          guessed: [],
          attempts: 0,
          maxAttempts: 6
        };
        showGameUI = true;
        // Play board game music
        useAudio.getState().playActivityMusic("hangman");
        console.log("AUDIO DEBUG: Playing hangman music");
        break;
        
      case "checkers":
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
        // Play board game music
        useAudio.getState().playActivityMusic("checkers");
        console.log("AUDIO DEBUG: Playing checkers music");
        break;
        
      case "seesaw":
        // Play seesaw music
        useAudio.getState().playActivityMusic("seesaw");
        console.log("AUDIO DEBUG: Playing seesaw music");
        break;
        
      case "lamp":
        // No special music for lamp
        break;
    }
    
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
    
    console.log(`Started ${type} interaction with object ${objectId}`);
  },
  
  endInteraction: () => {
    // Get current interaction type before clearing it
    const currentType = get().interactionType;
    
    // Stop any activity-specific music and return to background music
    if (currentType !== "none") {
      useAudio.getState().stopActivityMusic();
      console.log("AUDIO DEBUG: Stopping activity music and returning to background music");
    }
    
    set({
      interactionType: "none",
      interactingWithId: null,
      interactionPosition: null,
      interactionRotation: null,
      isSitting: false,
      isOnSeesaw: false,
      showGameUI: false
    });
    
    console.log("Ended interaction");
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