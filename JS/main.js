// this is a main JS file
// for loading the base functions and executing them
import { dragAndDropFiles } from "./fileSystem/DragAndDrop.js";
import internetConnection from "./internet/internetConnection.js";

dragAndDropFiles();
internetConnection();