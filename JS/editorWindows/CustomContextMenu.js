import EditorContainer from "./EditorContainer.js";

export default class CustomContextMenu {
    static contextMenu = null;
    static windowBar = null;

    static initialize() {
        // Prevent duplicate initialization
        if (this.contextMenu) return;

        this.contextMenu = document.createElement("div");
        this.contextMenu.classList.add("context-menu");

        const menuList = document.createElement("ul");

        // Create menu items
        const option1 = document.createElement("li");
        option1.textContent = "Split Right";
        option1.addEventListener("click", () => {
            EditorContainer.splitRight(this.windowBar);
        });

        const option2 = document.createElement("li");
        option2.textContent = "Split Down";
        option2.addEventListener("click", () => {
            // split down clicked
            console.log("split down clicked");
        });
        // Append items
        menuList.appendChild(option1);
        menuList.appendChild(option2);
        this.contextMenu.appendChild(menuList);

        // Append to body
        document.body.appendChild(this.contextMenu);

        // Hide menu when clicking elsewhere
        document.addEventListener("click", this.hide.bind(this));

        // Hide a menu on pressing an Escape key
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") this.hide();
        });
    }

    static show(event, windowBar) {
        event.preventDefault();
        this.initialize();

        // Position the menu
        this.windowBar = windowBar;
        this.contextMenu.style.top = `${event.clientY}px`;
        this.contextMenu.style.left = `${event.clientX}px`;
        this.contextMenu.style.display = "block";
    }

    static hide() {
        if (!this.contextMenu) return;
        this.contextMenu.style.display = "none";
        this.windowBar = undefined;
    }
}