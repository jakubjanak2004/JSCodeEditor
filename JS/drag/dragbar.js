import { getPointerPosition } from "./get-position.js";
import { getPointerPositionY } from "./get-position.js";

export function dragbarFunction() {
  const handlers = document.querySelectorAll(".lr-handler");
  const udHandlers = document.querySelectorAll('.ud-handler');
  const textEditorColumns = document.querySelectorAll(
    ".text-editor-column, #left-panel"
  );
  const textEditorRows = document.querySelectorAll('.text-editor-row');
  const boxMinWidth = 150;
  const boxMinHeight = 60;

  // setting the widths for the boxes
  textEditorColumns.forEach((column) => {
    column.style.width = `${column.offsetWidth}px`;
    column.style.flexGrow = 0;
  });

  // setting height for the rows
  textEditorRows.forEach((row) => {
    row.style.height = `${row.offsetHeight}px`;
    row.style.flexGrow = 0;
  });

  // setting the handler resizing
  handlers.forEach(handler => {
    const boxA = handler.previousElementSibling;
    const boxB = handler.nextElementSibling;
    let isHandlerDragging = false;

    function startResizing(e) {
      if (e.target === handler) {
        isHandlerDragging = true;
        handler.classList.add("selected");
        document.body.style.cursor = "ew-resize";
      }
    }

    function stopResizing() {
      if (isHandlerDragging) {
        isHandlerDragging = false;
        handler.classList.remove("selected");
        document.body.style.cursor = "default";
      }
    }

    function moveResizing(e) {
      if (!isHandlerDragging) return;

      // preventing default for mobile
      if (e.type === "touchmove") {
        e.preventDefault();
      }

      // boxA += resizeDelta, boxB -= resizeDelta
      const resizeDelta =
        getPointerPosition(e) - boxA.offsetLeft - boxA.offsetWidth;

      if (boxA.dataset.isCollapsable === "true") {
        if (boxA.offsetWidth + resizeDelta < boxA.offsetWidth / 2) {
          boxB.style.width = `${boxB.offsetWidth + boxA.offsetWidth}px`;
          boxA.style.width = "0px";
          return;
        }
      }

      if (boxA.offsetWidth + resizeDelta <= boxMinWidth) {
        return;
      }

      if (boxB.offsetWidth - resizeDelta <= boxMinWidth) {
        return;
      }

      if (resizeDelta > 0) {
        boxB.style.width = `${boxB.offsetWidth - resizeDelta}px`;
        boxA.style.width = `${boxA.offsetWidth + resizeDelta}px`;
      }
      if (resizeDelta < 0) {
        boxA.style.width = `${boxA.offsetWidth + resizeDelta}px`;
        boxB.style.width = `${boxB.offsetWidth - resizeDelta}px`;
      }
    }

    handler.addEventListener("mousedown", startResizing);
    handler.addEventListener("touchstart", startResizing);

    document.addEventListener("mousemove", moveResizing, { passive: false });
    document.addEventListener("touchmove", moveResizing, { passive: false });

    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchend", stopResizing);
  });

  udHandlers.forEach(handler => {
    const boxA = handler.previousElementSibling;
    const boxB = handler.nextElementSibling;
    let isHandlerDragging = false;

    function startResizing(e) {
      if (e.target === handler) {
        isHandlerDragging = true;
        handler.classList.add("selected");
        document.body.style.cursor = "ns-resize";
      }
    }

    function stopResizing() {
      if (isHandlerDragging) {
        isHandlerDragging = false;
        handler.classList.remove("selected");
        document.body.style.cursor = "default";
      }
    }

    function moveResizing(e) {
      if (!isHandlerDragging) return;

      // preventing default for mobile
      if (e.type === "touchmove") {
        e.preventDefault();
      }

      const resizeDelta = getPointerPositionY(e) - boxA.offsetTop - boxA.offsetHeight;

      if (boxA.offsetHeight + resizeDelta <= boxMinHeight) {
        return;
      }

      if (boxB.offsetHeight - resizeDelta <= boxMinHeight) {
        return;
      }

      if (resizeDelta > 0) {
        boxB.style.height = `${boxB.offsetHeight - resizeDelta}px`;
        boxA.style.height = `${boxA.offsetHeight + resizeDelta}px`;
      }
      if (resizeDelta < 0) {
        boxA.style.height = `${boxA.offsetHeight + resizeDelta}px`;
        boxB.style.height = `${boxB.offsetHeight - resizeDelta}px`;
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
