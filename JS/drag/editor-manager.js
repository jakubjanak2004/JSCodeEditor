import { getPointerPosition, getPointerPositionY } from "./get-position.js";
import { LRHandler, UDHandler } from "./dragbar.js";

const body = document.querySelector("body");

// handle receiving the moved window
function getReceiverWindow(x, y, currentBar) {
  const windowBars = document.querySelectorAll(".window-bar:not(.dragging)");
  windowBars.forEach((windowBar) => {
    if (windowBar !== currentBar) {
      let wBPosition = windowBar.getBoundingClientRect();
      if (
        Math.abs(x - wBPosition.left) < 10 &&
        Math.abs(y - wBPosition.top) < 45
      ) {
        windowBar.classList.add("left-highlight");
      } else {
        windowBar.classList.remove("left-highlight");
        windowBar.classList.remove("right-highlight");
      }

      if (windowBar === windowBar.parentElement.lastElementChild) {
        const relativeXPosition = x - wBPosition.left - windowBar.offsetWidth;
        if (
          x <
            windowBar.parentElement.offsetLeft +
              windowBar.parentElement.offsetWidth -
              10 &&
          relativeXPosition >= -10 &&
          Math.abs(y - wBPosition.top) < 45
        ) {
          windowBar.classList.add("right-highlight");
        }
      }
    }
  });
}

class EditorRow {
  textEditorRow;
  textEditorHeader;
  windowManagement;
  path;
  textEditorContent;
  editorColumn;
  windowBars = [];

  constructor(editorColumn) {
    this.editorColumn = editorColumn;

    // Create the main section
    this.textEditorRow = document.createElement("section");
    this.textEditorRow.classList.add("text-editor-row");

    // Create the header
    this.textEditorHeader = document.createElement("header");
    this.textEditorHeader.classList.add("editor-header");

    // Create the window management nav
    this.windowManagement = document.createElement("nav");
    this.windowManagement.classList.add("window-management");

    // Create the path section
    this.path = document.createElement("section");
    this.path.classList.add("path");

    // Append elements to the header
    this.textEditorHeader.appendChild(this.windowManagement);
    this.textEditorHeader.appendChild(this.path);

    // Create the text editor content div
    this.textEditorContent = document.createElement("div");
    this.textEditorContent.classList.add("text-editor-content");

    // Create line numbers div
    this.lineNumbers = document.createElement("div");
    this.lineNumbers.classList.add("line-numbers");

    // Create editable paragraph
    this.codeEdit = document.createElement("p");
    this.codeEdit.classList.add("code-edit");
    this.codeEdit.setAttribute("contenteditable", "true");

    // Append elements to the text editor content
    this.textEditorContent.appendChild(this.lineNumbers);
    this.textEditorContent.appendChild(this.codeEdit);

    // Append everything to the main textEditorRow
    this.textEditorRow.appendChild(this.textEditorHeader);
    this.textEditorRow.appendChild(this.textEditorContent);

    // appending text editor row to the text editor column object
    this.editorColumn.editorColumn.appendChild(this.textEditorRow);
  }

  addWindow(windowBar) {
    this.windowManagement.appendChild(windowBar.windowBar);
    this.windowBars.push(windowBar);
  }

  removeWindow(windowBar) {
    this.windowManagement.removeChild(windowBar.windowBar);
    this.windowBars = this.windowBars.filter((item) => item !== windowBar);
    if (!this.windowBars.length) {
      this.editorColumn.removeRow(this);
      this.textEditorRow.remove();
    }
  }

  setContent(content) {
    // Clear existing content
    this.codeEdit.innerHTML = "";

    // Split content by newlines
    const lines = content.split("\n");

    lines.forEach((line) => {
      const lineDiv = document.createElement("div");
      lineDiv.textContent = line;
      lineDiv.classList.add("text-div");
      this.codeEdit.appendChild(lineDiv);
    });
  }

  removeContent() {
    this.codeEdit.innerHTML = "";
  }
}

class EditorColumn {
  LRHandler;
  editorColumn;
  editorRows = [];

  constructor(editorContainer) {
    const lrHandler = document.createElement('div');
    lrHandler.classList.add('lr-handler');
    const highlight = document.createElement('div');
    highlight.classList.add('highlight');
    lrHandler.appendChild(highlight);
    EditorContainer.editorContainer.appendChild(lrHandler);

    this.editorColumn = document.createElement("div");
    this.editorColumn.classList.add("text-editor-column");
    editorContainer.appendChild(this.editorColumn);
    this.editorRows.push(new EditorRow(this));

    this.LRHandler = new LRHandler(lrHandler);
  }

  addWindow(windowBar) {
    this.editorRows[0].addWindow(windowBar);
    windowBar.editorRow = this.editorRows[0];
    return this.editorRows[0];
  }

  removeRow(editorRow) {
    this.editorRows = this.editorRows.filter((item) => item !== editorRow);
  }
}

class EditorContainer {
  static editorContainer = document.getElementById("editor-container");
  static editorColumns = [];

  static addNewWindowBar(windowBar) {
    if (this.editorColumns.length === 0) {
      this.editorColumns.push(new EditorColumn(this.editorContainer));
    }
    return this.editorColumns[0].addWindow(windowBar);
  }

  static splitRight(windowBar) {
    // const lrHandler = document.createElement('div');
    // lrHandler.classList.add('lr-handler');
    // const highlight = document.createElement('div');
    // highlight.classList.add('highlight');
    // lrHandler.appendChild(highlight);
    // this.editorContainer.appendChild(lrHandler);

    let newEditorColumn = new EditorColumn(this.editorContainer);

    // newEditorColumn.LRHandler = new LRHandler(lrHandler);

    this.editorColumns.push(newEditorColumn);
    windowBar.editorRow.removeWindow(windowBar);
    newEditorColumn.addWindow(windowBar);
    windowBar.setActive();
  }

  static splitDown() {
    // todo
  }
}

class CustomContextMenu {
  static contextMenu;
  static windowBar;

  static initialize() {
    if (this.contextMenu) return; // Prevent duplicate initialization

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
    document.addEventListener("click", () => this.hide());

    // Hide menu on pressing Escape key
    document.addEventListener("keydown", (event) => {
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
    if (this.contextMenu) {
      this.contextMenu.style.display = "none";
      this.windowBar = undefined;
    }
  }
}

export class WindowBar {
  entry;
  windowBar;
  editorRow;
  receiverWindow;
  isBarDragged = false;
  windowBarGhost;
  fileContent;
  filePath;

  constructor(entry) {
    this.entry = entry;
    this.windowBar = document.createElement("div");
    this.windowBar.classList.add("window-bar");
    this.windowBar.textContent = this.entry.name;
    const windowBarButton = document.createElement("button");
    windowBarButton.textContent = "x";

    windowBarButton.addEventListener("click", (e) => {
      this.windowBar.parentElement.removeChild(this.windowBar);
    });

    this.windowBar.appendChild(windowBarButton);

    // aqdding window into editor container
    EditorContainer.addNewWindowBar(this);

    // todo change into oop
    this.windowBar.addEventListener("dblclick", (e) => {
      this.setActive();
    });

    this.windowBar.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      CustomContextMenu.show(event, this);
    });

    // dragging and receiving logic
    this.windowBarGhost = document.createElement("div");
    this.windowBarGhost.classList.add("window-bar");
    this.windowBarGhost.classList.add("dragging");
    this.windowBarGhost.innerHTML = this.windowBar.innerHTML;

    this.windowBar.addEventListener("mousedown", this.startResizing.bind(this));
    this.windowBar.addEventListener(
      "touchstart",
      this.startResizing.bind(this)
    );

    document.addEventListener("mousemove", this.moveResizing.bind(this), {
      passive: false,
    });
    document.addEventListener("touchmove", this.moveResizing.bind(this), {
      passive: false,
    });

    document.addEventListener("mouseup", this.stopResizing.bind(this));
    document.addEventListener("touchend", this.stopResizing.bind(this));

    this.loadFileContent();
  }

  setActive() {
    this.editorRow.windowBars.forEach((windowBar) =>
      windowBar.windowBar.classList.remove("selected")
    );
    this.windowBar.classList.add("selected");
    this.editorRow.setContent(this.fileContent);

    this.editorRow.path.textContent = this.filePath;
  }

  startResizing(e) {
    if (e.target !== this.windowBar) return;
    this.isBarDragged = true;
    body.appendChild(this.windowBarGhost);
    document.body.style.cursor = "pointer";
  }

  moveResizing(e) {
    if (!this.isBarDragged) return;
    this.windowBarGhost.style.left = `${getPointerPosition(e)}px`;
    this.windowBarGhost.style.top = `${getPointerPositionY(e)}px`;
    this.receiverWindow = getReceiverWindow(
      getPointerPosition(e),
      getPointerPositionY(e),
      this.windowBar
    );
  }

  stopResizing() {
    if (!this.isBarDragged) return;
    this.isBarDragged = false;
    body.removeChild(this.windowBarGhost);
    document.body.style.cursor = "default";

    let receiveElement = document.querySelector(".window-bar.left-highlight");
    if (receiveElement) {
      this.windowBar.parentElement.removeChild(this.windowBar);
      receiveElement.parentElement.insertBefore(this.windowBar, receiveElement);
      receiveElement.classList.remove("left-highlight");
      return;
    }
    receiveElement = document.querySelector(".window-bar.right-highlight");
    if (receiveElement) {
      this.windowBar.parentElement.removeChild(this.windowBar);
      receiveElement.parentElement.appendChild(this.windowBar);
      receiveElement.classList.remove("right-highlight");
      return;
    }
  }

  loadFileContent() {
    if (this.entry && this.entry.isFile) {

      let path = this.entry.fullPath || this.entry.name; 
      path = path.replace("/", "");
      path = path.replaceAll("/", " > "); 
      this.filePath = path; 

      this.entry.file((file) => {
        // todo read on object creation
        const reader = new FileReader();

        reader.onload = (event) => {
          // Set the text content
          this.fileContent = event.target.result;
          this.setActive();
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
}
