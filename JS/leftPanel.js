import WindowBar from "./editorWindows/WindowBar.js";

class LeftPanelSection {
    entry;
    parentSection;
    sectionElement;
    padding;
    parentFolders = [];

    constructor(parentSection, entry, parentFolder) {
        this.entry = entry;
        this.parentSection = parentSection;
        if (parentFolder) {
            this.parentFolders.push(parentFolder);
        }

        this.sectionElement = document.createElement("li");
        this.parentSection.appendChild(this.sectionElement);

        // calculate the padding
        let depth = 0;
        let parent = this.sectionElement.parentElement;

        // Calculate the depth of nesting
        while (parent) {
            if (
                parent.tagName.toLowerCase() === "ul" &&
                parent.classList.contains("content")
            ) {
                depth++;
            }
            parent = parent.parentElement;
        }
        this.padding = `${depth * 10}px`;
    }
}

export class LeftPanelSectionFolder extends LeftPanelSection {
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

        this.loadSubFiles();
    }

    async loadSubFiles() {
        for await (const subEntry of this.entry.values()) {
            if (subEntry.kind === "file") {
                this.childFiles.push(
                    new LeftPanelSectionFile(this.content, subEntry, this.entry)
                );
            }
            if (subEntry.kind === "directory") {
                this.childFolders.push(
                    new LeftPanelSectionFolder(this.content, subEntry, this.entry)
                );
            }
        }
    }
}

export class LeftPanelSectionFile extends LeftPanelSection {
    windowBars = [];
    textContent;
    HTMLTextContent;
    filePath = "";
    name;
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
                console.log('Loading the text content');
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
                console.log('ctrl+s on dirty file')
                this.saveContentIntoFile().then(() => {
                    console.log('Contents of', this.name, 'saved');
                });
            }
        });
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
            console.log(this.entry);
            const file = await this.entry.getFile();

            // Read the contents of the file as text
            const text = await file.text();

            console.log('just read text', text);
            // todo change the function being called
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
