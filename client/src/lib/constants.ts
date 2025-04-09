// Control names for keyboard mapping
export enum ControlName {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  interact = "interact"
}

// Physics constants
export const PHYSICS = {
  CHARACTER_SPEED: 5,
  CHARACTER_TURN_SPEED: 2.5,
  GRAVITY: 9.8,
  JUMP_FORCE: 5
};

// Camera settings
export const CAMERA = {
  FOV: 60,
  NEAR: 0.1,
  FAR: 1000,
  FOLLOW_DISTANCE: 8,
  FOLLOW_HEIGHT: 4,
  LOOK_AHEAD: 1
};

// Street dimensions
export const STREET = {
  WIDTH: 10,
  LENGTH: 100,
  SIDEWALK_WIDTH: 4,
  BOUNDARY_MIN_X: -20,
  BOUNDARY_MAX_X: 20,
  BOUNDARY_MIN_Z: -50,
  BOUNDARY_MAX_Z: 50
};

// Animation parameters
export const ANIMATION = {
  HOVER_SPEED: 2,
  SKATING_SPEED: 5,
  DOOR_OPEN_DURATION: 2000
};

// Interaction settings
export const INTERACTION = {
  PROXIMITY_THRESHOLD: 5,
  RAYCAST_INTERVAL: 200
};
