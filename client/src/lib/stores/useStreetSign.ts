import { create } from 'zustand';

interface StreetSignState {
  isNearSign: boolean;
  showDetails: boolean;
  setIsNearSign: (near: boolean) => void;
  toggleDetails: () => void;
  closeDetails: () => void;
}

export const useStreetSign = create<StreetSignState>((set) => ({
  isNearSign: false,
  showDetails: false,
  setIsNearSign: (near) => set({ isNearSign: near }),
  toggleDetails: () => set((state) => ({ showDetails: !state.showDetails })),
  closeDetails: () => set({ showDetails: false }),
}));