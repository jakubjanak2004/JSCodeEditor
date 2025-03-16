import EditorContainer from "./EditorContainer.js";
import {LRHandler} from "../drag/handlers.js";
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
        this.editorRows.push(new EditorRow(this));

        this.LRHandler = new LRHandler(lrHandler);
    }

    addWindow(windowBar) {
        this.editorRows[0].addWindow(windowBar);
        windowBar.editorRow = this.editorRows[0];
        return this.editorRows[0];
    }

    removeRow(editorRow) {
        this.editorRows = this.editorRows.filter((item) => item !== editorRow);
    }
}
