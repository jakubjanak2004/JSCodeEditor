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
            // todo making this accessible on all browsers
            if ('getAsFileSystemHandle' in item) {
                handle = await item.getAsFileSystemHandle();
            } else if ('webkitGetAsEntry' in item) {
                handle = item.webkitGetAsEntry();
                alert('Browser does not support FileSystemHandle');
                return;
            } else {
                alert("Haven't been able to load dropped folder");
            }

            if (handle) {
                processEntry(handle, fileList);
            }
        }
    }

    function processEntry(entry, parentFolder) {
        if (entry.kind === 'file' || entry.isFile) {
            entry.file(file => {
                console.error('expected directory:', file);
            });
        } else if (entry.kind === 'directory' || entry.isDirectory) {
            console.log('folder given:', entry.name)
            new DirectoryFolder(parentFolder, entry);
        }
    }
}
