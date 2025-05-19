import WindowBar from "../../editorComponents/handler/WindowBar.js";
import Directory from "./Directory.js"
import FileContextMenu from "../../editorComponents/contextMenu/FileContextMenu.js";

// text file representation
export default class DirectoryFile extends Directory {
    windowBars = [];
    textContent;
    HTMLTextContent;
    filePath = "";
    contentDirty = false;
    onDblClick;
    // 1MB is the threshold for file opening
    maxSizeMB = 1
    maxSizeOfFile = this.maxSizeMB * 1024 * 1024;

    constructor(leftPanel, entry, parentFolder) {
        super(leftPanel, entry, parentFolder);
        this.sectionElement.classList.add("file");
        this.name = this.entry.name;
        this.sectionElement.textContent = this.name;
        this.sectionElement.style.paddingLeft = this.padding;

        this.onDblClick = this.handleDblclick.bind(this);
        this.sectionElement.addEventListener("dblclick", this.onDblClick);

        // saving the files
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

        //trigger contextmenu
        document.addEventListener('contextmenu', event => {
            if (event.target === this.sectionElement) {
                FileContextMenu.show(event, this);
            }
        });
    }

    // handle the creation of new window bars
    handleDblclick() {
        // if window bar exists dont create new onw
        if (this.windowBars.length > 0) {
            console.error('For now the creation of multiple window Bars for one file is not allowed');
            return;
        }

        // load Content on first WindowBar creation
        if (!this.textContent) {
            console.log('Loading the text content for', this.name);
            this.loadTextContent().then(() => {
                this.windowBars.push(new WindowBar(this));
                this.windowBars[this.windowBars.length - 1].setActive(true);
            });
        } else {
            // push the window bar
            this.windowBars.push(new WindowBar(this));
            this.windowBars[this.windowBars.length - 1].setActive(true);
        }
    }

    // delete this file
    async delete() {
        this.sectionElement.remove();
        for (const windowBar of this.windowBars) {
            windowBar.remove();
        }
        await this.entry.remove();
    }

    // save content into user computer filesystem
    async saveContentIntoFile() {
        const writable = await this.entry.createWritable();
        await writable.write(this.textContent);
        await writable.close();
        this.contentDirty = false;
    }

    // remove this window bar
    removeWindowBar(windowBar) {
        this.windowBars = this.windowBars.filter(item => {
            return item !== windowBar;
        })
    }

    // loading the text file content
    async loadTextContent() {
        // Get the File object from the file handle
        const file = await this.entry.getFile();

        // throw error if a file is too big
        if (file.size > this.maxSizeOfFile) {
            console.error('File size of', this.name, 'is too large');
            this.sectionElement.removeEventListener('dblclick', this.onDblClick);
            this.sectionElement.classList.add('big');
            throw Error(`File size of: ${file.size} is too large`);
        }

        // Read the contents of the file as text
        const text = await file.text();

        // update the file context
        this.updateTextContentOnLoad(text);

        // construct a file path
        let pFolder = this.parentFolders
        while (pFolder) {
            this.filePath = pFolder.name + " > " + this.filePath;
            pFolder = pFolder.parentFolders;
        }
        this.filePath += this.entry.name;
    }

    // update text content after loading it
    updateTextContentOnLoad(newContent) {
        this.textContent = newContent;
        this.HTMLTextContent = this.parseContent(newContent);
        this.windowBars.forEach(windowBar => {
            windowBar.setActive();
        });
    }

    // update text content after changing it
    // set the dirty flag to know that we need to save the contents
    updateTextContentChanged(newContent, updatingWindowBar) {
        this.contentDirty = true;
        this.textContent = newContent;
        this.HTMLTextContent = this.parseContent(newContent);
        // notify the windows about the content being changed
        this.windowBars.forEach(windowBar => {
            if (windowBar !== updatingWindowBar) {
                windowBar.setActive();
            }
        });
    }

    // parse content into html text div rows
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