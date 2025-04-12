import DirectoryContextMenu from "./DirectoryContextMenu.js";
import ContextMenu from "./ContextMenu.js";

export default class FolderContextMenu extends DirectoryContextMenu {
    static show(event, target, optionsPrepend = [], optionsAppend = []) {
        const option1 = document.createElement("li");
        option1.textContent = "New File";
        option1.addEventListener("click", () => {
            const newFileName = prompt("Enter the name of new file:");
            this.target.createNewFile(newFileName);
        });

        const option2 = document.createElement("li");
        option2.textContent = "New Folder";
        option2.addEventListener("click", () => {
            const newFolderName = prompt("Enter the name of new folder:");
            this.target.createNewFolder(newFolderName);
        });

        DirectoryContextMenu.show(event, target, [option1, option2]);
    }
}