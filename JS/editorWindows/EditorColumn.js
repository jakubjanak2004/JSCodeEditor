import EditorContainer from "./EditorContainer.js";
import {LRHandler} from "./handlers.js";
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

        const observer = new MutationObserver(() => {
            const editorRows = this.editorColumn.querySelectorAll('.text-editor-row');

            if (editorRows.length === 0) {
                this.editorColumn.remove();
                this.LRHandler.handler.remove();
                observer.disconnect();
            }
        });

        observer.observe(this.editorColumn, {
            childList: true,
            subtree: false
        });
    }

    addWindow(windowBar) {
        this.editorRows[0].addWindow(windowBar);
        windowBar.editorRow = this.editorRows[0].textEditorRow;
        return this.editorRows[0];
    }

    // todo checks if unnecessary or reimplement
    // removeRow(editorRow) {
    //     this.editorRows = this.editorRows.filter((item) => item !== editorRow);
    // }
}
