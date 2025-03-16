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
        // const lrHandler = document.createElement('div');
        // lrHandler.classList.add('lr-handler');
        // const highlight = document.createElement('div');
        // highlight.classList.add('highlight');
        // lrHandler.appendChild(highlight);
        // this.editorContainer.appendChild(lrHandler);

        let newEditorColumn = new EditorColumn(this.editorContainer);

        // newEditorColumn.LRHandler = new LRHandler(lrHandler);

        this.editorColumns.push(newEditorColumn);
        windowBar.editorRow.removeWindow(windowBar);
        newEditorColumn.addWindow(windowBar);
        windowBar.setActive();
    }

    static splitDown() {
        // todo
    }
}