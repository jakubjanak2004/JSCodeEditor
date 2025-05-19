import {DirectoryFolder} from "./directory/DirectoryFolder.js";

// function to handle drag and drop events
export function dragAndDropFiles() {
    const dropZone = document.querySelector(".drag-and-drop-panel");
    const fileList = document.getElementById("left-panel");

    // Prevent default utils behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((event) => {
        dropZone.addEventListener(event, (e) => e.preventDefault());
        document.body.addEventListener(event, (e) => e.preventDefault());
    });

    // make drop zone active
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
    // if browser does not support system handler user is alerted
    async function handleFiles(files) {
        for (const item of files) {
            let handle;
            if ('getAsFileSystemHandle' in item) {
                handle = await item.getAsFileSystemHandle();
            } else if ('webkitGetAsEntry' in item) {
                alert('Browser does not support FileSystemHandle');
                return;
            } else {
                alert("Haven't been able to load dropped folder");
                return;
            }

            if (handle) {
                processHandle(handle, fileList);
            }
        }
    }

    // process the given System Handle
    function processHandle(entry, parentFolder) {
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
