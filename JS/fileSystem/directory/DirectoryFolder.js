import Directory from "./Directory.js";
import DirectoryFile from "./DirectoryFile.js";
import FolderContextMenu from "../../editorComponents/contextMenu/FolderContextMenu.js";

// folder representation
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
        this.collapseButton.innerHTML = `<span class=collapse-sign>></span><span>${this.name}</span>`;
        this.collapseButton.style.paddingLeft = this.padding;
        this.sectionElement.appendChild(this.collapseButton);
        this.sectionElement.appendChild(this.content);

        // load subdirectories on first click
        this.collapseButton.addEventListener("click", () => {
            // subDirectories are lazy-loaded when the user opens the Folder
            this.loadSubDirectories().then(() => {
                console.log('sub files loaded for', this.entry.name)
            });
        }, {once: true});

        // open the directory in the sidebar
        this.collapseButton.addEventListener("click", () => {
            this.sectionElement.classList.toggle("opened");
            this.collapseButton.firstChild.classList.toggle("pressed");
        });

        // handle contextmenu
        document.addEventListener('contextmenu', event => {
            if (event.target === this.collapseButton) {
                FolderContextMenu.show(event, this);
            }
        });
    }

    // delete this folder
    async delete() {
        this.collapseButton.remove();
        this.content.remove();

        // recursively remove the folders and files inside
        for (const folder of this.childFolders) {
            await folder.delete()
        }
        for (const file of this.childFiles) {
            await file.delete();
        }

        await this.entry.remove();
    }

    // create a new file in the folder
    async createNewFile(fileName) {
        const newFileEntry = await this.entry.getFileHandle(fileName, {create: true});
        this.childFiles.push(
            new DirectoryFile(this.content, newFileEntry, this.entry)
        );
    }

    // create a new folder in this folder
    async createNewFolder(fileName) {
        const newFolderEntry = await this.entry.getDirectoryHandle(fileName, {create: true});
        this.childFolders.push(
            new DirectoryFolder(this.content, newFolderEntry, this.entry)
        );
    }

    // load all sub directories
    async loadSubDirectories() {
        for await (const subEntry of this.entry.values()) {
            if (subEntry.kind === "file") {
                this.childFiles.push(
                    new DirectoryFile(this.content, subEntry, this)
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