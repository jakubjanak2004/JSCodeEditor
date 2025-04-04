import { getPointerPosition } from "../drag/getPosition.js";
import { getPointerPositionY } from "../drag/getPosition.js";

const boxMinWidth = 150;
const boxMinHeight = 60;

export default class Handler {
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

    // set mutation observer to an boxA
    // if removed, widen the boxB
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.removedNodes.length) {
          mutation.removedNodes.forEach((removedNode) => {
            // todo works but maybe is not the best to access the style of a removed element
            // handle removed box
            if (removedNode === this.boxA) {
              this.boxB.style.width = `${this.boxB.offsetWidth + parseInt(this.boxA.style.width)}px`;

              this.boxA = this.handler.previousElementSibling;
              if (!this.boxA) {
                // unable to load the boxA, therefore removing the handler
                this.handler.remove();
              }
            }
            if (removedNode === this.boxB) {
              this.boxA.style.width =  `${this.boxA.offsetWidth + parseInt(this.boxB.style.width)}px`;

              this.boxB = this.handler.nextElementSibling;
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
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

    // todo make sure the flex grow is not set to 0 as it makes problems with the responsivity
    this.boxA.style.width = `${this.boxA.offsetWidth}px`;
    // this.boxA.style.flexGrow = "0";
    this.boxB.style.width = `${this.boxB.offsetWidth}px`;
    // this.boxB.style.flexGrow = "0";


  }

  startResizing(e) {
    e.preventDefault();
    if (e.target === this.handler) {
      this.isHandlerDragging = true;
      this.handler.classList.add("selected");
      document.body.style.cursor = "ew-resize";
    }
  }

  moveResizing(e) {
    e.preventDefault();

    if (!this.isHandlerDragging) return;

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
      this.boxA.style.width = `${this.boxA.offsetWidth + resizeDelta}px`;
      this.boxB.style.width = `${this.boxB.offsetWidth - resizeDelta}px`;
    }
    if (resizeDelta < 0) {
      this.boxB.style.width = `${this.boxB.offsetWidth - resizeDelta}px`;
      this.boxA.style.width = `${this.boxA.offsetWidth + resizeDelta}px`;
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
    e.preventDefault();
    if (e.target === this.handler) {
      this.isHandlerDragging = true;
      this.handler.classList.add("selected");
      document.body.style.cursor = "ns-resize";
    }
  }

  moveResizing(e) {
    e.preventDefault();

    if (!this.isHandlerDragging) return;

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
