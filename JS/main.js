import { dragbarFunction } from "./drag/dragbar.js";
import { leftPanel } from "./left-panel.js";
import { codeWindow } from "./code-window.js";
import { dragWindowBar } from "./drag/editor-manager.js";
import { dragAndDropFiles } from "./fileSystem/drag-and-drop.js";

leftPanel();
dragbarFunction();
codeWindow();
dragWindowBar();
dragAndDropFiles();