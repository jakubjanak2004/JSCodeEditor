// handler class
export default class Handler {
    handler;
    boxA;
    boxB;
    isHandlerDragging = false;

    constructor(handler) {
        this.handler = handler;

        this.handler.addEventListener("mousedown", e => this.startInteraction(e));
        this.handler.addEventListener("touchstart", e => this.startInteraction(e));

        document.addEventListener("mousemove", e => this.handleInteraction(e), {
            passive: false,
        });
        document.addEventListener("touchmove", e => this.handleInteraction(e), {
            passive: false,
        });

        document.addEventListener("mouseup", e => this.stopInteraction(e));
        document.addEventListener("touchend", e => this.stopInteraction(e));

        // set mutation observer to an boxA
        // handling the removal of boxA/B
        const observer = new MutationObserver(mutations => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length) {
                    mutation.removedNodes.forEach(removedNode => {
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

    // handle removed boxA/B
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

    // start the interaction process
    startInteraction(e) {
    }

    // stop the interaction process
    stopInteraction(e) {
        if (this.isHandlerDragging) {
            this.isHandlerDragging = false;
            this.handler.classList.remove("selected");
            document.body.style.cursor = "default";
        }
    }

    // handle an interaction process
    handleInteraction(e) {
        e.preventDefault();
    }
}