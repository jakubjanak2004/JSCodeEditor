export default class EditorRow {
    textEditorRow;
    textEditorHeader;
    windowManagement;
    path;
    textEditorContent;
    editorColumn;
    windowBars = [];

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
        this.path.classList.add("path");

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
        this.editorColumn.editorColumn.appendChild(this.textEditorRow);

        // adding row numbers
        const resizeObserver = new ResizeObserver(() => {
            this.updateLinNumber();
        });
        resizeObserver.observe(this.codeEdit);

        // line highlight
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.classList.contains("text-div")
                    ) {
                        createTextDiv(node);
                    }
                });
            });
        });

        observer.observe(this.codeEdit, { childList: true, subtree: false });

        this.codeEdit.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                return;
            }
            const textDivs = this.codeEdit.querySelectorAll(".text-div");
            if (
                textDivs.length === 1 &&
                e.key === "Backspace" &&
                !textDivs[0].textContent
            ) {
                e.preventDefault();
                return;
            }
            e.target.firstElementChild.listenToKeyPressed(e);
        });

        document.addEventListener("selectionchange", () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                document
                    .querySelectorAll(".text-div.focused")
                    .forEach((textDiv) => textDiv.classList.remove("focused"));

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
        });

        function createTextDiv(node) {
            node.listenToKeyPressed = function (e) {
                const key = e.key;
                console.log("handling key event from text div: ", key);
            };
        }

        //add txt as div rows
        document.addEventListener("DOMContentLoaded", (e) => {
            const newDiv = document.createElement("div");
            newDiv.classList.add("text-div");
            this.codeEdit.appendChild(newDiv);
        });
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
            this.lineNumbers.innerHTML += `<div class="line-numbers-block">
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
        this.windowBars.push(windowBar);
    }

    removeWindow(windowBar) {
        this.windowManagement.removeChild(windowBar.windowBar);
        this.windowBars = this.windowBars.filter((item) => item !== windowBar);
        if (!this.windowBars.length) {
            this.editorColumn.removeRow(this);
            this.textEditorRow.remove();
        }
    }

    setContent(content) {
        // Clear existing content
        this.codeEdit.innerHTML = "";

        // Split content by newlines
        const lines = content.split("\n");

        lines.forEach((line) => {
            const lineDiv = document.createElement("div");
            lineDiv.textContent = line;
            lineDiv.classList.add("text-div");
            this.codeEdit.appendChild(lineDiv);
        });
    }

    removeContent() {
        this.codeEdit.innerHTML = "";
    }
}
