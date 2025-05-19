// representing the directory, holding the handles
// File and Directory
//  extend abstract class representing the directory
export default class Directory {
    static PADDING_SIZE = 25;
    entry;
    name;
    parentDirectory;
    sectionElement;
    padding;
    parentFolders

    constructor(parentSection, entry, parentFolder) {
        this.entry = entry;
        this.name = entry.name;
        this.parentDirectory = parentSection;
        if (parentFolder) {
            this.parentFolders = parentFolder;
        }

        this.sectionElement = document.createElement("li");
        this.sectionElement.classList.add("text-truncate");
        this.parentDirectory.appendChild(this.sectionElement);

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
        this.padding = `${depth * Directory.PADDING_SIZE}px`;
    }
}