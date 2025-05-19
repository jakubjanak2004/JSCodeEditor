import {getPointerPositionY} from "../../utils/GetPosition.js";
import Handler from "./Handler.js";

// resize the boxes on the y-axis
// changing their height
export default class UDHandler extends Handler {
    constructor(handler) {
        super(handler);

        this.boxA = this.handler.previousElementSibling;
        this.boxAMinHeight = parseFloat(getComputedStyle(this.boxA).minHeight);
        this.boxB = this.handler.nextElementSibling;
    }

    startInteraction(e) {
        e.preventDefault();
        if (e.target === this.handler) {
            this.isHandlerDragging = true;
            this.handler.classList.add("selected");
            document.body.style.cursor = "ns-resize";
        }
    }

    handleInteraction(e) {
        super.handleInteraction(e);

        if (!this.isHandlerDragging) return;

        const resizeDelta =
            getPointerPositionY(e) - this.boxA.offsetTop - this.boxA.offsetHeight;

        if (this.boxA.offsetHeight + resizeDelta <= this.boxAMinHeight) {
            return;
        }

        if (this.boxB.offsetHeight - resizeDelta <= this.boxAMinHeight) {
            return;
        }

        // I am setting the height in specific order to avoid lagging
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
