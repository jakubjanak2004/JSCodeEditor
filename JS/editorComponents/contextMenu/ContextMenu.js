// abstract context menu class
// is singleton just the context are changing
export default class ContextMenu {
    static contextMenu = null;
    static target = null;
    contextMenuElement;
    menuList;

    // initialize the context menu
    static initialize(options = []) {
        // Prevent duplicate initialization
        if (ContextMenu.contextMenu) {
            // if instance exists update the options
            ContextMenu.contextMenu.setOptions(options);
            return;
        }

        ContextMenu.contextMenu = new ContextMenu(options);
    }

    constructor(options) {
        this.contextMenuElement = document.createElement("div");
        this.contextMenuElement.classList.add("context-menu");

        this.menuList = document.createElement("ul");

        this.setOptions(options);

        this.contextMenuElement.appendChild(this.menuList);

        // Append to body
        document.body.appendChild(this.contextMenuElement);

        // Hide menu when clicking elsewhere
        document.addEventListener("click", () => this.hide());

        // Hide a menu on pressing an Escape key
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") this.hide();
        });
    }

    // set clickable options in the menu list
    setOptions(options) {
        this.menuList.innerHTML = "";
        options.forEach(option => this.menuList.appendChild(option));
    }

    // show the context menu
    show(event, target, optionsPrepend = [], optionsAppend = []) {
        event.preventDefault();
        ContextMenu.initialize(optionsPrepend);

        // Position the menu
        ContextMenu.target = target;
        this.contextMenuElement.style.top = `${event.clientY}px`;
        this.contextMenuElement.style.left = `${event.clientX}px`;
        this.contextMenuElement.classList.remove("hidden");
    }

    // hide the context menu
    hide() {
        this.contextMenuElement.classList.add("hidden");
        ContextMenu.target = undefined;
    }
}

ContextMenu.initialize();