export default class EditorRow {
    textEditorRow;
    textEditorHeader;
    windowManagement;
    path;
    textEditorContent;
    editorColumn;
    windowBarCount = 0;
    UDHandler;

    constructor(editorColumn) {
        this.editorColumn = editorColumn;

        // Create the main section
        this.textEditorRow = document.createElement("section");
        this.textEditorRow.classList.add("text-editor-row");

        // Create the header
        this.textEditorHeader = document.createElement("header");
        this.textEditorHeader.classList.add("editor-header");

        // Create the window management nav
        this.windowManagement = document.createElement("nav");
        this.windowManagement.classList.add("window-management");

        // Create the path section
        this.path = document.createElement("section");
        this.path.classList.add("path", "text-truncate");

        // Append elements to the header
        this.textEditorHeader.appendChild(this.windowManagement);
        this.textEditorHeader.appendChild(this.path);

        // Create the text editor content div
        this.textEditorContent = document.createElement("div");
        this.textEditorContent.classList.add("text-editor-content");

        // Create line numbers div
        this.lineNumbers = document.createElement("div");
        this.lineNumbers.classList.add("line-numbers");

        // Create editable paragraph
        this.codeEdit = document.createElement("p");
        this.codeEdit.classList.add("code-edit");
        this.codeEdit.setAttribute("contenteditable", "true");

        // Append elements to the text editor content
        this.textEditorContent.appendChild(this.lineNumbers);
        this.textEditorContent.appendChild(this.codeEdit);

        // Append everything to the main textEditorRow
        this.textEditorRow.appendChild(this.textEditorHeader);
        this.textEditorRow.appendChild(this.textEditorContent);

        // appending text editor row to the text editor column object
        this.editorColumn.appendChild(this.textEditorRow);

        // adding row numbers
        const resizeObserver = new ResizeObserver(this.updateLinNumber.bind(this));
        resizeObserver.observe(this.codeEdit);

        // adding listen to key-pressed function
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                // Handle added nodes
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.reactOnTextDivAdded(node);
                        this.reactOnWindowBarAdded(node);
                    }
                }

                // Handle removed nodes
                for (const node of mutation.removedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.reactOnWindowBarRemoved(node);
                    }
                }
            }
        });

        observer.observe(this.codeEdit, { childList: true });
        observer.observe(this.windowManagement, { childList: true });

        this.codeEdit.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                return;
            }
            const textDivs = this.codeEdit.querySelectorAll(".text-div");
            if (
                textDivs.length === 1 &&
                event.key === "Backspace" &&
                !textDivs[0].textContent
            ) {
                event.preventDefault();
                return;
            }
            event.target.firstElementChild.listenToKeyPressed(event);
        });

        document.addEventListener("selectionchange", () => this.reactToSelectionChange());

        //add txt as div rows
        document.addEventListener("DOMContentLoaded", () => {
            const newDiv = document.createElement("div");
            newDiv.classList.add("text-div");
            this.codeEdit.appendChild(newDiv);
        });
    }

    reactOnWindowBarAdded(node) {
        if (!node.classList.contains('window-bar')) {
            return;
        }
        this.windowBarCount++;
    }

    reactOnWindowBarRemoved(node) {
        if (!node.classList.contains('window-bar')) {
            return;
        }
        // decrement selectedCount on windowBarRemoved
        this.textEditorRow.querySelectorAll('.window-bar').forEach(windowBar => {
            windowBar.dataset.selectedCount = parseInt(windowBar.dataset.selectedCount) - 1 + '';
        })
        this.windowBarCount--;
        if (!this.windowBarCount) {
            // remove this
            this.textEditorRow.remove();
            // remove UDHandler if is set
            if (this.UDHandler) {
                this.UDHandler.handler.remove();
            }
        }
    }

    reactOnTextDivAdded(node) {
        if (!node.classList.contains('text-div')) {
            return;
        }
        this.createTextDiv(node);
    }

    // todo entering in the text-div therefore creating new text divs the selection stops being triggered after few presses of the enter
    reactToSelectionChange() {
        // todo seeing the problem here
        console.log('react on selection being changed');
        const selection = window.getSelection();
        if (selection.rangeCount <= 0) return;
        document
            .querySelectorAll(".text-div.focused")
            .forEach(textDiv => textDiv.classList.remove("focused"));

        const selectedElement =
            selection.anchorNode.parentElement.classList.contains("text-div")
                ? selection.anchorNode.parentElement
                : selection.anchorNode;

        selectedElement.classList.add("focused");

        const nthLine = this.countPreviousElements(selectedElement, 'text-div');
        const lineNumbers = selectedElement.parentElement.parentElement.querySelectorAll('.line-number');
        document.querySelectorAll('.line-number.selected').forEach(lineNumber => lineNumber.classList.remove('selected'));
        lineNumbers[nthLine].classList.add('selected');
    }

    createTextDiv(node) {
        node.listenToKeyPressed = function (e) {
            // const key = e.key;
            // console.log("handling key event from text div: ", key);
        };
    }

    countPreviousElements(element, className) {
        let count = 0;
        let sibling = element.previousElementSibling;

        while (sibling) {
            if (sibling.classList.contains(className)) {
                count++;
            }
            sibling = sibling.previousElementSibling;
        }

        return count;
    }

    countLines() {
        // Get the height and line height of the contenteditable element
        const lineHeight = parseFloat(
            window.getComputedStyle(this.codeEdit).lineHeight,
            10
        );
        const height = this.codeEdit.offsetHeight;

        // Calculate how many lines fit into the element by dividing the height by line height
        return Math.floor(height / lineHeight);
    }

    updateLinNumber() {
        const numLines = this.countLines();
        let currentLineNumbers = this.lineNumbers.querySelectorAll(
            ".line-numbers-block"
        ).length;

        while (currentLineNumbers < numLines) {
            this.lineNumbers.innerHTML +=
                `<div class="line-numbers-block">
                    <div class="line-number">${currentLineNumbers + 1}</div>
                    <div class="highlighter"></div>
                </div>`;
            currentLineNumbers++;
        }

        while (currentLineNumbers > numLines) {
            this.lineNumbers.removeChild(this.lineNumbers.lastChild);
            currentLineNumbers--;
        }
    }

    addWindow(windowBar) {
        this.windowManagement.appendChild(windowBar.windowBar);
        windowBar.editorRow = this.textEditorRow;
    }
}
