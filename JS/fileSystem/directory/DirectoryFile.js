import WindowBar from "../../editorComponents/handler/WindowBar.js";
import Directory from "./Directory.js"
import FileContextMenu from "../../editorComponents/contextMenu/FileContextMenu.js";

export default class DirectoryFile extends Directory {
    windowBars = [];
    textContent;
    HTMLTextContent;
    filePath = "";
    contentDirty = false;

    constructor(leftPanel, entry, parentFolder) {
        super(leftPanel, entry, parentFolder);
        this.sectionElement.classList.add("file");
        this.name = this.entry.name;
        this.sectionElement.textContent = this.name;
        this.sectionElement.style.paddingLeft = this.padding;

        this.sectionElement.addEventListener("dblclick", () => {
            if (this.windowBars.length > 0) {
                console.error('For now the creation of multiple window Bars for one file is not allowed');
                return;
            }

            // load Content on first WindowBar creation
            if (!this.textContent) {
                console.log('Loading the text content for', this.name);
                this.loadTextContent().then(() => {
                    this.windowBars.push(new WindowBar(this));
                    this.windowBars[this.windowBars.length - 1].setActive();
                });
            } else {
                this.windowBars.push(new WindowBar(this));
                this.windowBars[this.windowBars.length - 1].setActive();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                if (!this.contentDirty) return;
                console.log('ctrl+s on dirty file, saving', this.name);
                this.saveContentIntoFile().then(() => {
                    console.log('Contents of', this.name, 'saved');
                });
            }
        });

        document.addEventListener('contextmenu', event => {
            if (event.target === this.sectionElement) {
                FileContextMenu.show(event, this);
            }
        });
    }

    // todo implement renaming for files
    async rename(newName) {

    }

    async delete() {
        this.sectionElement.remove();
        for (const windowBar of this.windowBars) {
            windowBar.remove();
        }
        await this.entry.remove();
    }

    async saveContentIntoFile() {
        const writable = await this.entry.createWritable();
        await writable.write(this.textContent);
        await writable.close();
        this.contentDirty = false;
    }

    removeWindowBar(windowBar) {
        this.windowBars = this.windowBars.filter(item => {
            return item !== windowBar;
        })
    }

    // loading the text file content
    async loadTextContent() {
        try {
            // Get the File object from the file handle
            const file = await this.entry.getFile();

            // Read the contents of the file as text
            const text = await file.text();

            console.log('just read text', text);
            this.updateTextContentOnLoad(text);
        } catch (error) {
            console.error('Error reading file:', error);
            throw error;
        }

        for (const folder of this.parentFolders) {
            this.filePath += folder.name + " > ";
        }
        this.filePath += this.entry.name;
    }

    updateTextContentOnLoad(newContent) {
        this.textContent = newContent;
        this.HTMLTextContent = this.parseContent(newContent);
        this.windowBars.forEach(windowBar => {
            windowBar.updateContent();
        });
    }

    updateTextContentChanged(newContent, updatingWindowBar) {
        this.contentDirty = true;
        this.textContent = newContent;
        this.HTMLTextContent = this.parseContent(newContent);
        // notify the windows about the content being changed
        this.windowBars.forEach(windowBar => {
            if (windowBar !== updatingWindowBar) {
                windowBar.updateContent();
            }
        });
    }

    parseContent(content) {
        // Clear existing content
        let HTMLContent = "";

        // Split content by newlines
        const lines = content.split("\n");

        lines.forEach(line => {
            HTMLContent += `<div class="text-div">${line}</div>`;
        });
        return HTMLContent;
    }
}