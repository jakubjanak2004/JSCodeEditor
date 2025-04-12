export const boxMinWidth = 150;
export const boxMinHeight = 60;

export default class Handler {
    handler;
    boxA;
    boxB;
    isHandlerDragging = false;

    constructor(handler) {
        this.handler = handler;

        this.handler.addEventListener("mousedown", e => this.startResizing(e));
        this.handler.addEventListener("touchstart", e => this.startResizing(e));

        document.addEventListener("mousemove", e => this.moveResizing(e), {
            passive: false,
        });
        document.addEventListener("touchmove", e => this.moveResizing(e), {
            passive: false,
        });

        document.addEventListener("mouseup", e => this.stopResizing(e));
        document.addEventListener("touchend", e => this.stopResizing(e));

        // set mutation observer to an boxA
        // if removed, widen the boxB
        const observer = new MutationObserver(mutations => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length) {
                    mutation.removedNodes.forEach((removedNode) => {
                        this.handleRemovedBox(removedNode);
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    handleRemovedBox(removedNode) {
        // handle boxA removed
        if (removedNode === this.boxA) {
            this.boxB.style.width = `${this.boxB.offsetWidth + parseInt(this.boxA.style.width)}px`;
            this.boxA = this.handler.previousElementSibling;
            if (!this.boxA) {
                // unable to load the boxA, therefore removing the handler
                this.handler.remove();
            }
        }
        // handle boxB removed
        if (removedNode === this.boxB) {
            this.boxA.style.width = `${this.boxA.offsetWidth + parseInt(this.boxB.style.width)}px`;
            this.boxB = this.handler.nextElementSibling;
        }
    }

    startResizing(e) {
    }

    stopResizing(e) {
        if (this.isHandlerDragging) {
            this.isHandlerDragging = false;
            this.handler.classList.remove("selected");
            document.body.style.cursor = "default";
        }
    }

    moveResizing(e) {
        e.preventDefault();
    }
}