import ContextMenu from "./ContextMenu.js";
import EditorContainer from "../EditorContainer.js";

export default class WindowBarContextMenu extends ContextMenu {
    static show(event, target, optionPrepend= [], optionsAppend =[]) {
        const option1 = document.createElement("li");
        option1.textContent = "Split Right";
        option1.addEventListener("click", () => {
            EditorContainer.splitRight(ContextMenu.target);
        });

        const option2 = document.createElement("li");
        option2.textContent = "Split Down";
        option2.addEventListener("click", () => {
            EditorContainer.splitDown(ContextMenu.target);
        });

        ContextMenu.contextMenu.show(event, target, [option1, option2]);
    }
}