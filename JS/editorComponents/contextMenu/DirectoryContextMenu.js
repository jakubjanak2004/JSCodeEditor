import ContextMenu from "./ContextMenu.js";

export default class DirectoryContextMenu extends ContextMenu {
    static initialize(optionsPrepend = [], optionsAppend = []) {
        const optionDelete = document.createElement("li");
        optionDelete.textContent = "Delete";
        optionDelete.addEventListener("click", () => {
            let userResponse = confirm("Are you sure you want to delete " + this.target.entry.name + " ?");
            if (userResponse) {
                this.target.delete();
            }
        });

        // todo implement
        // const option4 = document.createElement("li");
        // option4.textContent = "Rename";
        // option4.addEventListener("click", () => {
        //     const newDirectoryName = prompt("Enter the name of new directory:", this.target.entry.name);
        //     this.target.rename(newDirectoryName);
        // });

        super.initialize(optionsPrepend.concat([optionDelete], optionsAppend));
    }
}