import {getPointerPositionX} from "../../utils/GetPosition.js";
import Handler from "./Handler.js";

// resize the boxes on the x-axis
// changing their width
export default class LRHandler extends Handler {
    constructor(handler) {
        super(handler);

        this.boxA = this.handler.previousElementSibling;
        this.boxAMinWidth = parseFloat(getComputedStyle(this.boxA).minWidth);
        this.boxB = this.handler.nextElementSibling;

        this.boxA.style.width = `${this.boxA.offsetWidth}px`;
        this.boxB.style.width = `${this.boxB.offsetWidth}px`;
    }

    startInteraction(e) {
        e.preventDefault();
        if (e.target !== this.handler) return;
        this.isHandlerDragging = true;
        this.handler.classList.add("selected");
        document.body.style.cursor = "ew-resize";

    }

    handleInteraction(e) {
        super.handleInteraction(e);

        if (!this.isHandlerDragging) return;

        const resizeDelta =
            getPointerPositionX(e) - this.boxA.offsetLeft - this.boxA.offsetWidth;

        if (this.boxA.dataset.isCollapsable === "true") {
            if (this.boxA.offsetWidth + resizeDelta < this.boxA.offsetWidth / 2) {
                this.boxB.style.width = `${
                    this.boxB.offsetWidth + this.boxA.offsetWidth
                }px`;
                this.boxA.style.width = "0px";
                return;
            }
        }

        if (this.boxA.offsetWidth + resizeDelta <= this.boxAMinWidth) {
            return;
        }

        if (this.boxB.offsetWidth - resizeDelta <= this.boxAMinWidth) {
            return;
        }

        // I am setting the width in specific order to avoid lagging
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