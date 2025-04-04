import WindowBar from "./editorWindows/WindowBar.js";

class LeftPanelSection {
    entry;
    parentSection;
    sectionElement;
    padding;

    constructor(parentSection, entry) {
        this.entry = entry;
        this.parentSection = parentSection;

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

    constructor(leftPanel, entry) {
        super(leftPanel, entry);
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

        const dirReader = this.entry.createReader();
        dirReader.readEntries((entries) => {
            for (const subEntry of entries) {
                if (subEntry.isFile) {
                    this.childFiles.push(
                        new LeftPanelSectionFile(this.content, subEntry)
                    );
                }
                if (subEntry.isDirectory) {
                    this.childFolders.push(
                        new LeftPanelSectionFolder(this.content, subEntry)
                    );
                }
            }
        });
    }
}

export class LeftPanelSectionFile extends LeftPanelSection {
    windowBars = [];
    textContent;
    HTMLTextContent;
    filePath;
    name;

    constructor(leftPanel, entry) {
        super(leftPanel, entry);
        this.sectionElement.classList.add("file");
        this.name = this.entry.name;
        this.sectionElement.textContent = this.name;
        this.sectionElement.style.paddingLeft = this.padding;

        this.sectionElement.addEventListener("dblclick", () => {
            // load Content on first WindowBar creation
            if (!this.textContent) {
                this.loadTextContent();
            }
            this.windowBars.push(new WindowBar(this));
            this.windowBars[this.windowBars.length-1].setActive();
        });
    }

    // loading the text file content
    loadTextContent() {
        if (this.entry && this.entry.isFile) {
            let path = this.entry.fullPath || this.entry.name;
            path = path.replace("/", "");
            path = path.replaceAll("/", " > ");
            this.filePath = path;

            this.entry.file((file) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    this.notifyTextContentChanged(event.target.result);
                };

                reader.onerror = (error) => {
                    console.error("Error reading file:", error);
                };

                reader.readAsText(file);
            });
        } else {
            console.error("this.entry is not a valid file.");
        }
    }

    notifyTextContentChanged(newContent) {
        this.textContent = newContent;
        this.HTMLTextContent = this.parseContent(newContent);
        this.windowBars.forEach(windowBar => {
            windowBar.updateContent();
        })
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
