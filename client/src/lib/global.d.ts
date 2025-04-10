// Global declarations for TypeScript

interface ZoomChangeEventDetail {
  level: number;
}

interface WindowEventMap {
  'zoomchange': CustomEvent<ZoomChangeEventDetail>;
}

interface Window {
  isMouseRotating: boolean;
  currentZoomLevel?: number; // For persistent zoom level
  animationKeys?: {
    Z: boolean; // For dancing animation
    Q: boolean; // For waving left arm
    R: boolean; // For waving right arm
  };
}