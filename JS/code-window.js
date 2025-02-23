export function codeWindow() {
  const textEditorContents = document.querySelectorAll(".text-editor-content");

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

    // TODO: handling text div and focusing
    function createTextDiv() {
        const newDiv = document.createElement("div");
        newDiv.classList.add('text-div');
        // newDiv.setAttribute('contenteditable', 'true');
        newDiv.setAttribute('tabindex', '1');
        newDiv.addEventListener('keydown', e => {
            console.log(e.key);
            const key = e.key;
            if (key === 'Enter') {
                const addingDiv = createTextDiv();
                codeEdit.appendChild(addingDiv);
                addingDiv.focus();
                e.preventDefault();
                return;
            }
        });

        // handle divs focused unfocused
        newDiv.addEventListener('focus', e => {
            // console.log('focused');
            newDiv.classList.add('focused')
        });
        newDiv.addEventListener('blur', e => {
            // console.log('unfocused');
            newDiv.classList.remove('focused')
        });

        return newDiv;
    }

    //add txt as div rows
    document.addEventListener('DOMContentLoaded', e => {
        const newDiv = createTextDiv();
        codeEdit.appendChild(newDiv);
    });
  });
}
