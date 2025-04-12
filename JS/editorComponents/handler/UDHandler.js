import {getPointerPositionY} from "../../utils/GetPosition.js";
import Handler, {boxMinHeight} from "./Handler.js";

export default class UDHandler extends Handler {
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
