import { LeftPanelSectionFolder } from "../left-panel.js";
import { LeftPanelSectionFile } from "../left-panel.js";

export function dragAndDropFiles() {
  const dropZone = document.querySelector(".drag-and-drop-panel");
  const fileList = document.getElementById("left-panel");

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((event) => {
    dropZone.addEventListener(event, (e) => e.preventDefault());
    document.body.addEventListener(event, (e) => e.preventDefault());
  });

  document.addEventListener("dragenter", () => {
    dropZone.classList.add("active");
  });

  // Highlight drop zone when file is dragged over
  ["dragenter", "dragover"].forEach((event) => {
    // dropZone.addEventListener(event, () => dropZone.classList.add("active"));
  });

  // Remove highlight when dragging leaves
  ["dragleave", "drop"].forEach((event) => {
    dropZone.addEventListener(event, () => dropZone.classList.remove("active"));
  });

  // Handle dropped files
  dropZone.addEventListener("drop", (event) => {
    const files = event.dataTransfer.items;
    handleFiles(files);
  });

  // add files to a filesystem
  function handleFiles(files) {
    console.log(files);

    for (const item of files) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        processEntry(entry, fileList);
      }
    }
  }

  function processEntry(entry, parentFolder) {
    if (entry.isFile) {
      entry.file((file) => {
        console.log('expected directory:', file);
      });
    } else if (entry.isDirectory) {
      new LeftPanelSectionFolder(parentFolder, entry);
    }
  }
}
