export const boxMinWidth = 150;
export const boxMinHeight = 60;

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