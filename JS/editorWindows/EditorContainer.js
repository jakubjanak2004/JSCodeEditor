import EditorColumn from "./EditorColumn.js";

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

    static splitDown() {
        // todo
    }
}