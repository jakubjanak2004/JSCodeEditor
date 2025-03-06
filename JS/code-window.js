export function codeWindow() {
  const textEditorContents = document.querySelectorAll(".text-editor-content");

  function countPreviousElements(element, className) {
    let count = 0;
    let sibling = element.previousElementSibling;

    while (sibling) {
        if (sibling.classList.contains(className)) {
            count++;
        }
        sibling = sibling.previousElementSibling;
    }

    return count;
}

  // update numbers
  textEditorContents.forEach((textEditorContent) => {
    const lineNumbers = textEditorContent.querySelector(".line-numbers");
    const codeText = textEditorContent.querySelector(".code-edit");

    // TODO: correct
    function countLines() {
      // Get the height and line height of the contenteditable element
      const lineHeight = parseFloat(
        window.getComputedStyle(codeText).lineHeight,
        10
      );
      const height = codeText.offsetHeight;

      // Calculate how many lines fit into the element by dividing the height by line height
      return Math.floor(height / lineHeight);
    }

    function updateLinNumber() {
      const numLines = countLines();
      let currentLineNumbers = lineNumbers.querySelectorAll(
        ".line-numbers-block"
      ).length;

      while (currentLineNumbers < numLines) {
        lineNumbers.innerHTML += `<div class="line-numbers-block">
                    <div class="line-number">${currentLineNumbers + 1}</div>
                    <div class="highlighter"></div>
                </div>`;
        currentLineNumbers++;
      }

      while (currentLineNumbers > numLines) {
        lineNumbers.removeChild(lineNumbers.lastChild);
        currentLineNumbers--;
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updateLinNumber();
    });

    document.addEventListener("DOMContentLoaded", () => updateLinNumber());
    resizeObserver.observe(codeText);
  });

  // handle typing
  textEditorContents.forEach((textEditorContent) => {
    const codeEdit = textEditorContent.querySelector(".code-edit");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("text-div")
          ) {
            createTextDiv(node);
          }
        });
      });
    });

    observer.observe(codeEdit, { childList: true, subtree: false });

    codeEdit.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        return;
      }
      const textDivs = codeEdit.querySelectorAll(".text-div");
      if (
        textDivs.length === 1 &&
        e.key === "Backspace" &&
        !textDivs[0].textContent
      ) {
        e.preventDefault();
        return;
      }
      e.target.firstElementChild.listenToKeyPressed(e);
    });

    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        document
          .querySelectorAll(".text-div.focused")
          .forEach((textDiv) => textDiv.classList.remove("focused"));

        const selectedElement =
          selection.anchorNode.parentElement.classList.contains("text-div")
            ? selection.anchorNode.parentElement
            : selection.anchorNode;
            // todo: causing issues remove later
        // selectedElement.classList.add("focused");

        const nthLine = countPreviousElements(selectedElement, 'text-div');
        const lineNumbers = selectedElement.parentElement.parentElement.querySelectorAll('.line-number');
        document.querySelectorAll('.line-number.selected').forEach(lineNumber => lineNumber.classList.remove('selected'));
        // lineNumbers[nthLine].classList.add('selected');
      }
    });

    function createTextDiv(node) {
      node.listenToKeyPressed = function (e) {
        const key = e.key;
        console.log("handling key event from text div: ", key);
      };
    }

    //add txt as div rows
    document.addEventListener("DOMContentLoaded", (e) => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("text-div");
      codeEdit.appendChild(newDiv);
    });
  });
}
