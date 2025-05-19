// static object representing the global path in the footer section
export default class GlobalPath {
    static pathElement = document.getElementById("global-path");
    static setPath(path) {
        this.pathElement.textContent = path;
    }
    static erasePath() {
        this.pathElement.textContent = "";
    }
}