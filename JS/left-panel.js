import { WindowBar } from './drag/editor-manager.js';

export function leftPanel() {
  const leftPanelCollapsebuttons = document.querySelectorAll(".collapse-sign");
  const files = document.querySelectorAll(".file");
  const folders = document.querySelectorAll(".folder");

  leftPanelCollapsebuttons.forEach((button) => {
    button.parentElement.addEventListener("click", (e) => {
      let parentElement = button.parentElement;
      while (parentElement.tagName.toLowerCase() === "button") {
        parentElement = parentElement.parentElement;
      }
      parentElement.classList.toggle("opened");
      button.classList.toggle("pressed");
    });
  });

  files.forEach((file) => {
    let initialDepth = 5;
    let depth = 0;
    let parent = file.parentElement;

    // Calculate the depth of nesting
    while (parent) {
      if (parent.tagName.toLowerCase() === "li") {
        depth++;
      }
      parent = parent.parentElement;
    }

    file.style.paddingLeft = `${depth * 10 + initialDepth}px`;
  });

  folders.forEach((folder) => {
    let depth = 0;
    let parent = folder.parentElement;

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

    folder.style.paddingLeft = `${depth * 10}px`;
  });
}

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
    this.collapseButton.addEventListener("click", (e) => {
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

  constructor(leftPanel, entry) {
    super(leftPanel, entry);
    this.sectionElement.classList.add("file");
    this.sectionElement.textContent = this.entry.name;
    this.sectionElement.style.paddingLeft = this.padding;

    this.sectionElement.addEventListener("dblclick", (event) => {
      this.windowBars.push(new WindowBar(this.entry));
    });
  }
}
