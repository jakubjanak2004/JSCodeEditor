import { getPointerPosition } from "./get-position.js";
import { getPointerPositionY } from "./get-position.js";

const boxMinWidth = 150;
const boxMinHeight = 60;

// todo add the similar code into the handler class

class Handler {
  handler;
  boxA;
  boxB;
  isHandlerDragging = false;

  constructor(handler) {
    this.handler = handler;

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

  startResizing() {}

  stopResizing() {
    if (this.isHandlerDragging) {
      this.isHandlerDragging = false;
      this.handler.classList.remove("selected");
      document.body.style.cursor = "default";
    }
  }

  moveResizing() {}
}

export class LRHandler extends Handler {
  constructor(handler) {
    super(handler);

    this.boxA = this.handler.previousElementSibling;
    this.boxB = this.handler.nextElementSibling;

    this.boxA.style.width = `${this.boxA.offsetWidth}px`;
    this.boxA.style.flexGrow = "0";
    this.boxB.style.width = `${this.boxB.offsetWidth}px`;
    this.boxB.style.flexGrow = "0";
  }

  startResizing(e) {
    if (e.target === this.handler) {
      this.isHandlerDragging = true;
      this.handler.classList.add("selected");
      document.body.style.cursor = "ew-resize";
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

    this.boxA = this.handler.previousElementSibling;
    this.boxB = this.handler.nextElementSibling;
  }

  startResizing(e) {
    if (e.target === this.handler) {
      this.isHandlerDragging = true;
      this.handler.classList.add("selected");
      document.body.style.cursor = "ns-resize";
    }
  }

  moveResizing(e) {
    if (!this.isHandlerDragging) return;

    // preventing default for mobile
    if (e.type === "touchmove") {
      e.preventDefault();
    }

    const resizeDelta =
      getPointerPositionY(e) - this.boxA.offsetTop - this.boxA.offsetHeight;

    if (this.boxA.offsetHeight + resizeDelta <= boxMinHeight) {
      return;
    }

    if (this.boxB.offsetHeight - resizeDelta <= boxMinHeight) {
      return;
    }

    if (resizeDelta > 0) {
      this.boxB.style.height = `${this.boxB.offsetHeight - resizeDelta}px`;
      this.boxA.style.height = `${this.boxA.offsetHeight + resizeDelta}px`;
    }
    if (resizeDelta < 0) {
      this.boxA.style.height = `${this.boxA.offsetHeight + resizeDelta}px`;
      this.boxB.style.height = `${this.boxB.offsetHeight - resizeDelta}px`;
    }
  }
}
