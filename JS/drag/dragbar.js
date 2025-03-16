import { getPointerPosition } from "./get-position.js";
import { getPointerPositionY } from "./get-position.js";

const boxMinWidth = 150;
const boxMinHeight = 60;

class Handler {
  handler;
  boxA;
  boxB;
  isHandlerDragging = false;

  constructor(handler) {
    this.handler = handler;
  }
}

export class LRHandler extends Handler {
  constructor(handler) {
    super(handler);

    this.boxA = handler.previousElementSibling;
    this.boxB = handler.nextElementSibling;

    console.log(this.boxA, this.boxB)

    this.boxA.style.width = `${this.boxA.offsetWidth}px`;
    this.boxA.style.flexGrow = "0";
    this.boxB.style.width = `${this.boxB.offsetWidth}px`;
    this.boxB.style.flexGrow = "0";

    this.handler.addEventListener("mousedown", this.startResizing.bind(this));
    this.handler.addEventListener("touchstart", this.startResizing.bind(this));

    document.addEventListener("mousemove", this.moveResizing.bind(this), {
      passive: false,
    });
    document.addEventListener("touchmove", this.moveResizing.bind(this), {
      passive: false,
    });

    document.addEventListener("mouseup", this.stopResizing.bind(this));
    document.addEventListener("touchend", this.stopResizing.bind(this));
  }

  startResizing(e) {
    if (e.target === this.handler) {
      this.isHandlerDragging = true;
      this.handler.classList.add("selected");
      document.body.style.cursor = "ew-resize";
    }
  }

  stopResizing() {
    if (this.isHandlerDragging) {
      this.isHandlerDragging = false;
      this.handler.classList.remove("selected");
      document.body.style.cursor = "default";
    }
  }

  moveResizing(e) {
    if (!this.isHandlerDragging) return;

    // preventing default for mobile
    if (e.type === "touchmove") {
      e.preventDefault();
    }

    // boxA += resizeDelta, boxB -= resizeDelta
    const resizeDelta =
      getPointerPosition(e) - this.boxA.offsetLeft - this.boxA.offsetWidth;

    if (this.boxA.dataset.isCollapsable === "true") {
      if (this.boxA.offsetWidth + resizeDelta < this.boxA.offsetWidth / 2) {
        this.boxB.style.width = `${
          this.boxB.offsetWidth + this.boxA.offsetWidth
        }px`;
        this.boxA.style.width = "0px";
        return;
      }
    }

    if (this.boxA.offsetWidth + resizeDelta <= boxMinWidth) {
      return;
    }

    if (this.boxB.offsetWidth - resizeDelta <= boxMinWidth) {
      return;
    }

    if (resizeDelta > 0) {
      this.boxB.style.width = `${this.boxB.offsetWidth - resizeDelta}px`;
      this.boxA.style.width = `${this.boxA.offsetWidth + resizeDelta}px`;
    }
    if (resizeDelta < 0) {
      this.boxA.style.width = `${this.boxA.offsetWidth + resizeDelta}px`;
      this.boxB.style.width = `${this.boxB.offsetWidth - resizeDelta}px`;
    }
  }
}

export class UDHandler extends Handler {
  constructor(handler) {
    super(handler);

    this.boxA = handler.previousElementSibling;
    this.boxB = handler.nextElementSibling;
    // this.isHandlerDragging = false;

    handler.addEventListener("mousedown", this.startResizing);
    handler.addEventListener("touchstart", this.startResizing);

    document.addEventListener("mousemove", this.moveResizing, {
      passive: false,
    });
    document.addEventListener("touchmove", this.moveResizing, {
      passive: false,
    });

    document.addEventListener("mouseup", this.stopResizing);
    document.addEventListener("touchend", this.stopResizing);
  }

  startResizing(e) {
    if (e.target === handler) {
      isHandlerDragging = true;
      handler.classList.add("selected");
      document.body.style.cursor = "ns-resize";
    }
  }

  stopResizing() {
    if (isHandlerDragging) {
      isHandlerDragging = false;
      handler.classList.remove("selected");
      document.body.style.cursor = "default";
    }
  }

  moveResizing(e) {
    if (!isHandlerDragging) return;

    // preventing default for mobile
    if (e.type === "touchmove") {
      e.preventDefault();
    }

    const resizeDelta =
      getPointerPositionY(e) - boxA.offsetTop - boxA.offsetHeight;

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
}
