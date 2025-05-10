import {DirectoryFolder} from "./directory/DirectoryFolder.js";

export function dragAndDropFiles() {
    const dropZone = document.querySelector(".drag-and-drop-panel");
    const fileList = document.getElementById("left-panel");

    // Prevent default utils behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((event) => {
        dropZone.addEventListener(event, (e) => e.preventDefault());
        document.body.addEventListener(event, (e) => e.preventDefault());
    });

    document.addEventListener("dragenter", () => {
        dropZone.classList.add("active");
    });

    // Highlight drop zone when a file is dragged over
    ["dragenter", "dragover"].forEach((event) => {
        // dropZone.addEventListener(event, () => dropZone.classList.add("active"));
    });

    // Remove highlight when dragging leaves
    ["dragleave", "drop"].forEach((event) => {
        dropZone.addEventListener(event, () => dropZone.classList.remove("active"));
    });

    // Handle dropped files
    dropZone.addEventListener("drop", event => {
        const files = event.dataTransfer.items;
        handleFiles(files);
    });

    // add files to a filesystem
    async function handleFiles(files) {
        for (const item of files) {
            let handle;
            if ('getAsFileSystemHandle' in item) {
                handle = await item.getAsFileSystemHandle();
            } else {
                alert("This browser does not support SystemHandle");
            }

            if (handle) {
                processEntry(handle, fileList);
            }
        }
    }

    function processEntry(entry, parentFolder) {
        if (entry.kind === 'file') {
            entry.file(file => {
                console.error('expected directory:', file);
            });
        } else if (entry.kind === 'directory') {
            console.log('folder given:', entry.name)
            new DirectoryFolder(parentFolder, entry);
        }
    }
}
