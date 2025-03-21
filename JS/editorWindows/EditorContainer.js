import EditorColumn from "./EditorColumn.js";
import EditorRow from "./EditorRow.js";
import {UDHandler} from "./handlers.js";

export default class EditorContainer {
    static editorContainer = document.getElementById("editor-container");
    static editorColumns = [];

    static addNewWindowBar(windowBar) {
        if (this.editorColumns.length === 0) {
            this.editorColumns.push(new EditorColumn(this.editorContainer));
        }
        return this.editorColumns[0].addWindow(windowBar);
    }

    static splitRight(windowBar) {
        let newEditorColumn = new EditorColumn(this.editorContainer);

        this.editorColumns.push(newEditorColumn);
        windowBar.editorRow.querySelector('.window-management').removeChild(windowBar.windowBar);
        newEditorColumn.addWindow(windowBar);
        windowBar.setActive();
    }

    static splitDown(windowBar) {
        const editorColumn = windowBar.windowBar.closest('.text-editor-column');

        const udHandler = document.createElement('div');
        udHandler.classList.add('ud-handler');
        editorColumn.appendChild(udHandler);

        const highlight = document.createElement('div');
        highlight.classList.add('highlight');
        udHandler.appendChild(highlight);

        let newEditorRow = new EditorRow(editorColumn);
        windowBar.editorRow.querySelector('.window-management').removeChild(windowBar.windowBar);
        newEditorRow.addWindow(windowBar);
        windowBar.setActive();

        new UDHandler(udHandler);
    }
}