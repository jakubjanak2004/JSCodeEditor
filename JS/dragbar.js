export function dragbarFunction() {
  const handlers = document.querySelectorAll(".lr-handler");
  const textEditorColumns = document.querySelectorAll('.text-editor-column, #left-panel');
  const boxMinWidth = 150;

  // setting the widths for the boxes
  textEditorColumns.forEach((column) => {
    column.style.width = `${column.offsetWidth}px`;
    column.style.flexGrow = 0;
  });

  // setting the handler resizing
  handlers.forEach((handler) => {
    const boxA = handler.previousElementSibling;
    const boxB = handler.nextElementSibling;
    let isHandlerDragging = false;

    function getPointerPosition(e) {
      if (e.touches) {
        return e.touches[0].clientX;
      }
      return e.clientX;
    }

    function startResizing(e) {
      if (e.target === handler) {
        isHandlerDragging = true;
        handler.classList.add("selected");
        document.body.style.cursor = "ew-resize";
      }
    }

    function moveResizing(e) {
      if (!isHandlerDragging) return;

      // preventing default for mobile
      if (e.type === "touchmove") {
        e.preventDefault();
      }

      // Get pointer position (works for both mouse and touch)
      const containerOffsetLeft = boxA.offsetLeft;
      const pointerRelativeXpos = getPointerPosition(e) - containerOffsetLeft;

      const distanceFromRight = Math.abs(pointerRelativeXpos - boxMinWidth);

      if (boxA.dataset.isCollapsable === "true") {
        if (pointerRelativeXpos <= distanceFromRight) {
          boxB.style.width = `${boxB.offsetWidth + boxA.offsetWidth}px`;
          boxA.style.width = "0px";
          return;
        }
      }

      // Resize box A based on pointer position
      let resizeDifference = Math.max(boxMinWidth, pointerRelativeXpos) - boxA.offsetWidth;

      if (boxB.offsetWidth - resizeDifference <= boxMinWidth) {
        return;
      }

      boxA.style.width = `${boxA.offsetWidth + resizeDifference}px`;
      boxB.style.width = `${boxB.offsetWidth - resizeDifference}px`;
    }

    function stopResizing() {
      if (isHandlerDragging) {
        isHandlerDragging = false;
        handler.classList.remove("selected");
        document.body.style.cursor = "default";
      }
    }

    handler.addEventListener("mousedown", startResizing);
    handler.addEventListener("touchstart", startResizing);

    document.addEventListener("mousemove", moveResizing, { passive: false });
    document.addEventListener("touchmove", moveResizing, { passive: false });

    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchend", stopResizing);
  });
}
