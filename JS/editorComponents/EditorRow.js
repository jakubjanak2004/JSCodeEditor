import GlobalPath from "./GlobalPath.js";

// editor row representation
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
        const resizeObserver = new ResizeObserver(this.updateLineNumber.bind(this));
        resizeObserver.observe(this.codeEdit);

        // observing for changes
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                // Handle text div added
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.reactOnTextDivAdded(node);
                        this.reactOnWindowBarAdded(node);
                    }
                }

                // Handle window bar removed
                for (const node of mutation.removedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.reactOnWindowBarRemoved(node);
                    }
                }
            }
        });

        observer.observe(this.codeEdit, {childList: true});
        observer.observe(this.windowManagement, {childList: true});
        document.addEventListener("selectionchange", () => this.reactToSelectionChange());
    }

    // react on new window bar being added
    reactOnWindowBarAdded(node) {
        if (!node.classList.contains('window-bar')) {
            return;
        }
        this.windowBarCount++;
    }

    // react on window bar being removed
    // if window bar count is 0 then remove the row
    reactOnWindowBarRemoved(node) {
        if (!node.classList.contains('window-bar')) {
            return;
        }
        // skip the decrement if the windowBar was removed and added to this row
        if (node.parentElement !== this.windowManagement) {
            // decrement selectedCount on windowBarRemoved
            this.textEditorRow.querySelectorAll('.window-bar').forEach(windowBar => {
                windowBar.dataset.selectedCount = parseInt(windowBar.dataset.selectedCount) - 1 + '';
            })
        }
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

    // add new test div
    reactOnTextDivAdded(node) {
        if (!node.classList.contains('text-div')) {
            return;
        }
    }

    // todo comment
    reactToSelectionChange() {
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
        // setting GlobalPath to the selected file path
        const selectedRow = document.querySelector('.text-editor-row:has(.text-div.focused)');
        if (selectedRow) {
            const path = selectedRow.querySelector('.path');
            GlobalPath.setPath(path.textContent);
        }

        const nthLine = this.countPreviousElements(selectedElement, 'text-div');
        const lineNumbers = selectedElement.parentElement.parentElement.querySelectorAll('.line-number');
        document.querySelectorAll('.line-number.selected').forEach(lineNumber => lineNumber.classList.remove('selected'));
        lineNumbers[nthLine].classList.add('selected');
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

    // count the number of text lines in the code editor row
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

    // update the number of lines after adding, removing the text div
    updateLineNumber() {
        const numLines = this.countLines();
        let currentLineNumbers = this.lineNumbers.querySelectorAll(
            ".line-numbers-block"
        ).length;

        // adding the line numbers
        while (currentLineNumbers < numLines) {
            this.lineNumbers.innerHTML +=
                `<div class="line-numbers-block">
                    <div class="line-number">${currentLineNumbers + 1}</div>
                    <div class="highlighter"></div>
                </div>`;
            currentLineNumbers++;
        }

        // removing excessive line numbers
        while (currentLineNumbers > numLines) {
            this.lineNumbers.removeChild(this.lineNumbers.lastChild);
            currentLineNumbers--;
        }
    }

    // add window bar into the editor row
    addWindowBar(windowBar) {
        this.windowManagement.appendChild(windowBar.windowBar);
        windowBar.editorRow = this.textEditorRow;
    }
}
