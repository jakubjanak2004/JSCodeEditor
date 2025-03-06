import { getPointerPosition } from "./get-position.js";
import { getPointerPositionY } from "./get-position.js";

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
      // split right clicked
      console.log("split right clicked");

      const editorContainer = document.getElementById("editor-container");
      const newEditorColumn = document.createElement("section");
      console.log(editorContainer, newEditorColumn);
      newEditorColumn.innerHTML = `
      <section class="text-editor-column">
        <section class="text-editor-row">
          <header class="editor-header">
              <nav class="window-management">
              </nav>
              <section class="path">codeEditor > nextProject > main > next.js</section>
          </header>
          <div class="text-editor-content">
              <div class="line-numbers"></div>
              <p class="code-edit" contenteditable="true"></p>
          </div>
        </section>
      </section>`;

      editorContainer.innerHTML += `<div class="lr-handler"><div class="highlight"></div></div>`;
      editorContainer.appendChild(newEditorColumn);
      const windowManagement =
        newEditorColumn.querySelector(".window-management");
      this.windowBar.parentElement.removeChild(this.windowBar);
      windowManagement.appendChild(this.windowBar);
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

  constructor(entry) {
    this.entry = entry;

    const firstEditorRow = document.querySelector(".text-editor-row");
    const firstEditorHeader =
      firstEditorRow.querySelector(".window-management");
    const windowBar = document.createElement("div");
    windowBar.classList.add("window-bar");
    windowBar.textContent = this.entry.name;
    const windowBarButton = document.createElement("button");
    windowBarButton.textContent = "x";

    windowBarButton.addEventListener("click", (e) => {
      windowBar.parentElement.removeChild(windowBar);
    });

    windowBar.appendChild(windowBarButton);
    firstEditorHeader.appendChild(windowBar);

    windowBar.addEventListener("dblclick", (e) => {
      const textWindow = windowBar.parentElement.parentElement.parentElement
        .querySelector(".text-editor-content")
        .querySelector(".code-edit");

      // Check if `this.entry` exists and is a file
      // add text into code edit from file
      if (this.entry && this.entry.isFile) {
        this.entry.file((file) => {
          const reader = new FileReader();

          reader.onload = (event) => {
            console.log(textWindow);
            textWindow.textContent = event.target.result; // Set the text content
          };

          reader.onerror = (error) => {
            console.error("Error reading file:", error);
          };

          reader.readAsText(file); // Read the file as text
        });
      } else {
        console.error("this.entry is not a valid file.");
      }
    });

    windowBar.addEventListener("contextmenu", (event) => {
      event.preventDefault();

      CustomContextMenu.show(event, windowBar);

      // contextMenu.style.top = `${event.clientY}px`;
      // contextMenu.style.left = `${event.clientX}px`;
      // contextMenu.style.display = "block";
    });

    // document.addEventListener("click", () => {
    // contextMenu.style.display = "none";
    // });

    // dragging and receiving logic
    let receiverWindow = undefined;
    let isBarDragged = false;
    const windowBarGhost = document.createElement("div");
    windowBarGhost.classList.add("window-bar");
    windowBarGhost.classList.add("dragging");
    windowBarGhost.innerHTML = windowBar.innerHTML;

    function startResizing(e) {
      if (e.target !== windowBar) return;
      isBarDragged = true;
      body.appendChild(windowBarGhost);
      document.body.style.cursor = "pointer";
    }

    // todo handle adding the element to window management
    function stopResizing() {
      if (!isBarDragged) return;
      isBarDragged = false;
      body.removeChild(windowBarGhost);
      document.body.style.cursor = "default";

      let receiveElement = document.querySelector(".window-bar.left-highlight");
      if (receiveElement) {
        windowBar.parentElement.removeChild(windowBar);
        receiveElement.parentElement.insertBefore(windowBar, receiveElement);
        receiveElement.classList.remove("left-highlight");
        return;
      }
      receiveElement = document.querySelector(".window-bar.right-highlight");
      if (receiveElement) {
        windowBar.parentElement.removeChild(windowBar);
        receiveElement.parentElement.appendChild(windowBar);
        receiveElement.classList.remove("right-highlight");
        return;
      }
    }

    function moveResizing(e) {
      if (!isBarDragged) return;
      windowBarGhost.style.left = `${getPointerPosition(e)}px`;
      windowBarGhost.style.top = `${getPointerPositionY(e)}px`;
      receiverWindow = getReceiverWindow(
        getPointerPosition(e),
        getPointerPositionY(e),
        windowBar
      );
    }

    windowBar.addEventListener("mousedown", startResizing);
    windowBar.addEventListener("touchstart", startResizing);

    document.addEventListener("mousemove", moveResizing, { passive: false });
    document.addEventListener("touchmove", moveResizing, { passive: false });

    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchend", stopResizing);
  }
}
