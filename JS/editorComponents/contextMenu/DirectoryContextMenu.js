import ContextMenu from "./ContextMenu.js";

// context menu for directory
export default class DirectoryContextMenu extends ContextMenu {
    static show(event, target, optionsPrepend = [], optionsAppend = []) {
        const optionDelete = document.createElement("li");
        optionDelete.textContent = "Delete";
        optionDelete.addEventListener("click", () => {
            let userResponse = confirm("Are you sure you want to delete " + this.target.entry.name + " ?");
            if (userResponse) {
                ContextMenu.target.delete();
            }
        });

        ContextMenu.contextMenu.show(event, target, optionsPrepend.concat([optionDelete], optionsAppend));
    }
}