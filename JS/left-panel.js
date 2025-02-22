export function leftPanel() {
  const leftPanelCollapsebuttons =
    document.querySelectorAll(".collapse-button");
  const files = document.querySelectorAll(".file");
  const folders = document.querySelectorAll(".folder");

  leftPanelCollapsebuttons.forEach((button) => {
    button.parentElement.addEventListener("click", (e) => {
      let parentElement = button.parentElement;
      while (parentElement.tagName.toLowerCase() === "span") {
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

  folders.forEach(folder => {
    let depth = 0;
    let parent = folder.parentElement;

    // Calculate the depth of nesting
    while (parent) {
      if (parent.tagName.toLowerCase() === "ul" && parent.classList.contains('content')) {
        depth++;
      }
      parent = parent.parentElement;
    }

    folder.style.paddingLeft = `${depth * 10}px`;
  })
}
