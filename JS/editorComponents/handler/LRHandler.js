import {getPointerPosition} from "../../drag/GetPosition.js";
import Handler, {boxMinWidth} from "./Handler.js";

export default class LRHandler extends Handler {
    constructor(handler) {
        super(handler);

        this.boxA = this.handler.previousElementSibling;
        this.boxB = this.handler.nextElementSibling;

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