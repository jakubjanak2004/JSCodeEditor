import {getPointerPositionX, getPointerPositionY} from "../../utils/GetPosition.js";
import EditorContainer from "../EditorContainer.js";
import WindowBarContextMenu from "../contextMenu/WindowBarContextMenu.js";
import Handler from "./Handler.js";

export default class WindowBar extends Handler {
    leftPanelSectionFile;
    windowBar;
    editorRow;
    isBarDragged = false;
    windowBarGhost;

    constructor(leftPanelSectionFile) {
        const windowBarGhost = document.createElement("div");
        super(windowBarGhost);
        this.leftPanelSectionFile = leftPanelSectionFile;
        this.windowBar = document.createElement("div");
        this.windowBar.classList.add("window-bar");
        this.windowBar.innerHTML = `<p class="text-truncate">${this.leftPanelSectionFile.name}</p>`;
        const windowBarButton = document.createElement("button");
        windowBarButton.textContent = "x";

        windowBarButton.addEventListener("click", event => {
            this.windowBar.remove();
            this.leftPanelSectionFile.removeWindowBar(this);
        });

        this.windowBar.appendChild(windowBarButton);

        // adding a window into editor container
        this.editorRow = EditorContainer.addNewWindowBar(this).textEditorRow;

        this.windowBar.addEventListener("dblclick", () => {
            this.setActive();
        });

        this.windowBar.addEventListener('contextmenu', event => {
            WindowBarContextMenu.show(event, this);
        });

        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-selected-count') {
                    this.handleDataSelectedCount();
                }
            }
        });

        observer.observe(this.windowBar, {
            attributes: true,
            attributeFilter: ['data-selected-count'],
        });

        // dragging and receiving logic
        this.windowBarGhost = windowBarGhost;
        this.windowBarGhost.classList.add("window-bar");
        this.windowBarGhost.classList.add("ghost");
        this.windowBarGhost.innerHTML = this.windowBar.innerHTML;

        this.windowBar.addEventListener("mousedown", e => this.startResizing(e));
        this.windowBar.addEventListener(
            "touchstart",
            this.startResizing.bind(this)
        );
    }

    handleDataSelectedCount() {
        const newValue = this.windowBar.dataset.selectedCount;
        if (newValue === "1") {
            // if selection-count is 1 and this.windowBar is not selected
            if (!this.windowBar.classList.contains('selected')) {
                this.setHTMLForSelected();
            }
        }
    }

    remove() {
        this.windowBar.remove();
    }

    updateContent() {
        this.setActive();
    }

    setActive() {
        this.windowBar.parentElement.querySelectorAll('.window-bar')
            .forEach(windowBar => windowBar.classList.remove('selected'));
        this.windowBar.classList.add("selected");
        this.setSelected();
        this.setHTMLForSelected();
    }

    setHTMLForSelected() {
        this.windowBar.classList.add('selected');
        this.editorRow.querySelector('.path').textContent = this.leftPanelSectionFile.filePath;
        const codeEdit = this.editorRow.querySelector('.code-edit');
        codeEdit.innerHTML = this.leftPanelSectionFile.HTMLTextContent;
        codeEdit.onkeyup = () => {
            let content = "";
            const textDivs = codeEdit.querySelectorAll('.text-div');
            const totalDivs = textDivs.length;
            textDivs.forEach((line, index) => {
                content += line.textContent;
                if (index !== totalDivs - 1) {
                    content += '\n';
                }
            });
            this.leftPanelSectionFile.updateTextContentChanged(content, this);
        }
    }

    setSelected() {
        let wasSelection;
        if (this.windowBar.dataset.selectedCount) {
            wasSelection = parseInt(this.windowBar.dataset.selectedCount);
        }
        this.windowBar.dataset.selectedCount = '0';
        this.editorRow.querySelectorAll('.window-bar').forEach(windowBar => {
            let selectedCountInt = parseInt(windowBar.dataset.selectedCount);
            if (!wasSelection || selectedCountInt <= wasSelection) {
                windowBar.dataset.selectedCount = selectedCountInt + 1 + '';
            }
        })
    }

    startResizing(e) {
        console.log('here clicking', e.target)
        if (e.target !== this.windowBar) return;
        this.isBarDragged = true;
        document.body.appendChild(this.windowBarGhost);
        document.body.style.cursor = "pointer";
    }

    moveResizing(e) {
        // todo maybe isBarDragged can be moved to the super overridden method
        if (!this.isBarDragged) return;
        this.windowBarGhost.style.left = `${getPointerPositionX(e)}px`;
        this.windowBarGhost.style.top = `${getPointerPositionY(e)}px`;
        this.getReceiverWindow(
            getPointerPositionX(e),
            getPointerPositionY(e),
            this.windowBar
        );
    }

    // todo refactor the code here
    getReceiverWindow(x, y, currentBar) {
        const windowBars = document.querySelectorAll(".window-bar:not(.ghost)");
        windowBars.forEach(windowBar => {
            if (windowBar !== currentBar) {
                let wBPosition = windowBar.getBoundingClientRect();
                if (
                    Math.abs(x - wBPosition.left) < 10 &&
                    Math.abs(y - wBPosition.top) < 45
                ) {
                    windowBar.classList.add("left-highlight");
                } else {
                    windowBar.classList.remove("left-highlight");
                    windowBar.classList.remove("right-highlight");
                }

                if (windowBar === windowBar.parentElement.lastElementChild) {
                    const relativeXPosition = x - wBPosition.left - windowBar.offsetWidth;
                    if (
                        x <
                        windowBar.parentElement.offsetLeft +
                        windowBar.parentElement.offsetWidth -
                        10 &&
                        relativeXPosition >= -10 &&
                        Math.abs(y - wBPosition.top) < 45
                    ) {
                        windowBar.classList.add("right-highlight");
                    }
                }
            }
        });
    }

    stopResizing(e) {
        if (!this.isBarDragged) return;
        this.isBarDragged = false;
        document.body.removeChild(this.windowBarGhost);
        document.body.style.cursor = "default";

        let receiveElement = document.querySelector(".window-bar.left-highlight");
        if (receiveElement) {
            this.windowBar.parentElement.removeChild(this.windowBar);
            receiveElement.parentElement.insertBefore(this.windowBar, receiveElement);
            receiveElement.classList.remove("left-highlight");
            this.editorRow = receiveElement.parentElement.parentElement.parentElement;
            this.setActive()
            return;
        }
        receiveElement = document.querySelector(".window-bar.right-highlight");
        if (receiveElement) {
            this.windowBar.parentElement.removeChild(this.windowBar);
            receiveElement.parentElement.appendChild(this.windowBar);
            receiveElement.classList.remove("right-highlight");
            this.editorRow = receiveElement.parentElement.parentElement.parentElement;
            this.setActive()
        }
    }
}