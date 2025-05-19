// These are utility functions to get position various events
//
// return the X position of the mouse or user finger
export function getPointerPositionX(e) {
  if (e.touches) {
    return e.touches[0].clientX;
  }
  return e.clientX;
}

// return the Y position of the mouse or user finger
export function getPointerPositionY(e) {
  if (e.touches) {
    return e.touches[0].clientY;
  }
  return e.clientY;
}
