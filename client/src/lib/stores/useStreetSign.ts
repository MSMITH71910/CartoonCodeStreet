import { create } from 'zustand';

interface StreetSignState {
  isNearSign: boolean;
  showDetails: boolean;
  showAboutInfo: boolean;
  setIsNearSign: (near: boolean) => void;
  toggleDetails: () => void;
  closeDetails: () => void;
  openAboutInfo: () => void;
  closeAboutInfo: () => void;
}

export const useStreetSign = create<StreetSignState>((set) => ({
  isNearSign: false,
  showDetails: false,
  showAboutInfo: false,
  setIsNearSign: (near) => set({ isNearSign: near }),
  toggleDetails: () => set((state) => ({ showDetails: !state.showDetails })),
  closeDetails: () => set({ showDetails: false }),
  openAboutInfo: () => set({ showAboutInfo: true }),
  closeAboutInfo: () => set({ showAboutInfo: false }),
}));