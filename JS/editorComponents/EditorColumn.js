import EditorContainer from "./EditorContainer.js";
import LRHandler from "./handler/LRHandler.js";
import EditorRow from "./EditorRow.js";

export default class EditorColumn {
    LRHandler;
    editorColumn;
    editorRows = [];

    constructor(editorContainer) {
        const lrHandler = document.createElement('div');
        lrHandler.classList.add('lr-handler');

        const highlight = document.createElement('div');
        highlight.classList.add('highlight');
        lrHandler.appendChild(highlight);

        EditorContainer.editorContainer.appendChild(lrHandler);

        this.editorColumn = document.createElement("div");
        this.editorColumn.classList.add("text-editor-column");
        editorContainer.appendChild(this.editorColumn);
        this.editorRows.push(new EditorRow(this.editorColumn));

        this.LRHandler = new LRHandler(lrHandler);

        const observer = new MutationObserver((mutations) => {
            const editorRows = this.editorColumn.querySelectorAll('.text-editor-row');

            if (editorRows.length === 0 && document.querySelectorAll('.text-editor-column').length > 1) {
                this.editorColumn.remove();
                this.LRHandler.handler.remove();
                observer.disconnect();
                EditorContainer.removeColumn(this);
            }

            mutations.forEach(mutation => {
                if (mutation.removedNodes.length) {
                    mutation.removedNodes.forEach((removedNode) => {
                        if (removedNode.classList && removedNode.classList.contains('text-editor-row')) {
                            this.editorRows = this.editorRows.filter(r => r.textEditorRow !== removedNode);
                        }
                    });
                }
            });
        });

        observer.observe(this.editorColumn, {
            childList: true,
            subtree: false
        });
    }

    addWindow(windowBar) {
        if (this.editorRows.length === 0) {
            this.editorRows.push(new EditorRow(this.editorColumn));
        }
        this.editorRows[0].addWindow(windowBar);
        windowBar.editorRow = this.editorRows[0].textEditorRow;
        return this.editorRows[0];
    }
}
