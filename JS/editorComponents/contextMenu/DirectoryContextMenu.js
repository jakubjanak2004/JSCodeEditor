import ContextMenu from "./ContextMenu.js";

export default class DirectoryContextMenu extends ContextMenu {
    static initialize() {
        // todo
        const option1 = document.createElement("li");
        option1.textContent = "New File";
        option1.addEventListener("click", () => {
            const newFileName = prompt("Enter the name of new file:");
            this.target.createNewFile(newFileName)
        });

        const option2 = document.createElement("li");
        option2.textContent = "New Folder";
        option2.addEventListener("click", () => {
            const newFolderName = prompt("Enter the name of new folder:");
            this.target.createNewFolder(newFolderName)
        });

        const option3 = document.createElement("li");
        option3.textContent = "Delete";
        option3.addEventListener("click", () => {
            let userResponse = confirm("Are you sure you want to delete " + this.target.entry.name + " ?");
            if (userResponse) {
                this.target.delete();
            }
        });

        // todo implement
        const option4 = document.createElement("li");
        option4.textContent = "Rename";
        option4.addEventListener("click", () => {
            const newDirectoryName = prompt("Enter the name of new directory:", this.target.entry.name);
            this.target.rename(newDirectoryName);
        });

        super.initialize([option1, option2, option3, option4]);
    }
}