import { create } from "zustand";
import * as THREE from "three";
import { type Project } from "../data/projects";
import { type RefObject } from "react";

interface PortfolioState {
  // References
  characterRef: RefObject<THREE.Group> | null;
  cameraTarget: THREE.Vector3;
  
  // Project interaction
  activeProject: Project | null;
  isViewingProject: boolean;
  
  // Actions
  setCharacterRef: (ref: RefObject<THREE.Group>) => void;
  setActiveProject: (project: Project) => void;
  closeProject: () => void;
}

export const usePortfolio = create<PortfolioState>((set) => ({
  // Initialize references
  characterRef: null,
  cameraTarget: new THREE.Vector3(0, 1, 0),
  
  // Initialize project state
  activeProject: null,
  isViewingProject: false,
  
  // Set character reference
  setCharacterRef: (ref) => set({ characterRef: ref }),
  
  // Set active project and update view state
  setActiveProject: (project) => set({ 
    activeProject: project,
    isViewingProject: true
  }),
  
  // Close project details and return to street view
  closeProject: () => set({ 
    activeProject: null,
    isViewingProject: false
  })
}));
