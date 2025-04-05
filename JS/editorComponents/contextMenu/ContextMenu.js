export default class ContextMenu {
    static contextMenu = null;
    static target = null;

    static initialize(options) {
        // Prevent duplicate initialization
        if (this.contextMenu) return;

        this.contextMenu = document.createElement("div");
        this.contextMenu.classList.add("context-menu");

        const menuList = document.createElement("ul");

        options.forEach(option => menuList.appendChild(option));

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

    static show(event, target) {
        event.preventDefault();
        this.initialize();

        // Position the menu
        this.target = target;
        this.contextMenu.style.top = `${event.clientY}px`;
        this.contextMenu.style.left = `${event.clientX}px`;
        this.contextMenu.style.display = "block";
    }

    static hide() {
        if (!this.contextMenu) return;
        this.contextMenu.style.display = "none";
        this.target = undefined;
    }
}