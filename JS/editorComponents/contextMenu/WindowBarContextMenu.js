import ContextMenu from "./ContextMenu.js";
import EditorContainer from "../EditorContainer.js";

export default class WindowBarContextMenu extends ContextMenu {
    static initialize() {
        const option1 = document.createElement("li");
        option1.textContent = "Split Right";
        option1.addEventListener("click", () => {
            EditorContainer.splitRight(this.target);
        });

        const option2 = document.createElement("li");
        option2.textContent = "Split Down";
        option2.addEventListener("click", () => {
            EditorContainer.splitDown(this.target);
        });

        super.initialize([option1, option2]);
    }
}