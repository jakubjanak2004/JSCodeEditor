import Directory from "./Directory.js";
import DirectoryFile from "./DirectoryFile.js";

export class DirectoryFolder extends Directory {
    collapseButton;
    content;
    childFolders = [];
    childFiles = [];

    constructor(leftPanel, entry, parentFolder) {
        super(leftPanel, entry, parentFolder);
        this.entry = entry;

        this.content = document.createElement("ul");
        this.content.classList.add("content");

        this.collapseButton = document.createElement("button");
        this.collapseButton.classList.add("collapse-button");
        this.collapseButton.classList.add("folder");
        this.collapseButton.innerHTML = `<span class=collapse-sign>></span><span>${entry.name}</span>`;
        this.collapseButton.style.paddingLeft = this.padding;
        this.collapseButton.addEventListener("click", () => {
            this.sectionElement.classList.toggle("opened");
            this.collapseButton.firstChild.classList.toggle("pressed");
        });

        this.sectionElement.appendChild(this.collapseButton);
        this.sectionElement.appendChild(this.content);

        this.loadSubFiles().then(r => {
            console.log('sub files loaded for', this.entry.name)
        });
    }

    async loadSubFiles() {
        for await (const subEntry of this.entry.values()) {
            if (subEntry.kind === "file") {
                this.childFiles.push(
                    new DirectoryFile(this.content, subEntry, this.entry)
                );
            }
            if (subEntry.kind === "directory") {
                this.childFolders.push(
                    new DirectoryFolder(this.content, subEntry, this.entry)
                );
            }
        }
    }
}