import {getPointerPosition, getPointerPositionY} from "../drag/get-position.js";
import {EditorContainer} from "./EditorContainer.js";
import {CustomContextMenu} from "./CustomContextMenu.js";

export class WindowBar {
    entry;
    windowBar;
    editorRow;
    receiverWindow;
    isBarDragged = false;
    windowBarGhost;
    fileContent;
    filePath;

    constructor(entry) {
        this.entry = entry;
        this.windowBar = document.createElement("div");
        this.windowBar.classList.add("window-bar");
        this.windowBar.textContent = this.entry.name;
        const windowBarButton = document.createElement("button");
        windowBarButton.textContent = "x";

        windowBarButton.addEventListener("click", (e) => {
            this.windowBar.parentElement.removeChild(this.windowBar);
        });

        this.windowBar.appendChild(windowBarButton);

        // adding window into editor container
        EditorContainer.addNewWindowBar(this);

        // todo change into oop
        this.windowBar.addEventListener("dblclick", (e) => {
            this.setActive();
        });

        this.windowBar.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            CustomContextMenu.show(event, this);
        });

        // dragging and receiving logic
        this.windowBarGhost = document.createElement("div");
        this.windowBarGhost.classList.add("window-bar");
        this.windowBarGhost.classList.add("dragging");
        this.windowBarGhost.innerHTML = this.windowBar.innerHTML;

        this.windowBar.addEventListener("mousedown", this.startResizing.bind(this));
        this.windowBar.addEventListener(
            "touchstart",
            this.startResizing.bind(this)
        );

        document.addEventListener("mousemove", this.moveResizing.bind(this), {
            passive: false,
        });
        document.addEventListener("touchmove", this.moveResizing.bind(this), {
            passive: false,
        });

        document.addEventListener("mouseup", this.stopResizing.bind(this));
        document.addEventListener("touchend", this.stopResizing.bind(this));

        this.loadFileContent();
    }

    setActive() {
        this.editorRow.windowBars.forEach((windowBar) =>
            windowBar.windowBar.classList.remove("selected")
        );
        this.windowBar.classList.add("selected");
        this.editorRow.setContent(this.fileContent);

        this.editorRow.path.textContent = this.filePath;
    }

    startResizing(e) {
        if (e.target !== this.windowBar) return;
        this.isBarDragged = true;
        body.appendChild(this.windowBarGhost);
        document.body.style.cursor = "pointer";
    }

    moveResizing(e) {
        if (!this.isBarDragged) return;
        this.windowBarGhost.style.left = `${getPointerPosition(e)}px`;
        this.windowBarGhost.style.top = `${getPointerPositionY(e)}px`;
        this.receiverWindow = getReceiverWindow(
            getPointerPosition(e),
            getPointerPositionY(e),
            this.windowBar
        );
    }

    stopResizing() {
        if (!this.isBarDragged) return;
        this.isBarDragged = false;
        body.removeChild(this.windowBarGhost);
        document.body.style.cursor = "default";

        let receiveElement = document.querySelector(".window-bar.left-highlight");
        if (receiveElement) {
            this.windowBar.parentElement.removeChild(this.windowBar);
            receiveElement.parentElement.insertBefore(this.windowBar, receiveElement);
            receiveElement.classList.remove("left-highlight");
            return;
        }
        receiveElement = document.querySelector(".window-bar.right-highlight");
        if (receiveElement) {
            this.windowBar.parentElement.removeChild(this.windowBar);
            receiveElement.parentElement.appendChild(this.windowBar);
            receiveElement.classList.remove("right-highlight");
            return;
        }
    }

    loadFileContent() {
        if (this.entry && this.entry.isFile) {

            let path = this.entry.fullPath || this.entry.name;
            path = path.replace("/", "");
            path = path.replaceAll("/", " > ");
            this.filePath = path;

            this.entry.file((file) => {
                // todo read on object creation
                const reader = new FileReader();

                reader.onload = (event) => {
                    // Set the text content
                    this.fileContent = event.target.result;
                    this.setActive();
                };

                reader.onerror = (error) => {
                    console.error("Error reading file:", error);
                };

                reader.readAsText(file);
            });
        } else {
            console.error("this.entry is not a valid file.");
        }
    }
}