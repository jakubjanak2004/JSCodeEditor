export function getPointerPosition(e) {
  if (e.touches) {
    return e.touches[0].clientX;
  }
  return e.clientX;
}

export function getPointerPositionY(e) {
  if (e.touches) {
    return e.touches[0].clientY;
  }
  return e.clientY;
}
