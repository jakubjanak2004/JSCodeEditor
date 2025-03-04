import { getPointerPosition } from "./get-position.js";
import { getPointerPositionY } from "./get-position.js";

const body = document.querySelector("body");

export function dragWindowBar() {
  const windowBars = document.querySelectorAll(".window-bar");

  function getReceiverWindow(x, y, currentBar) {
    windowBars.forEach(windowBar => {
      if (windowBar !== currentBar) {
        let wBPosition = windowBar.getBoundingClientRect();
        if (Math.abs(x - wBPosition.left) < 10 && Math.abs(y - wBPosition.top) < 45) {
          windowBar.classList.add('left-highlight');
        } else {
          windowBar.classList.remove('left-highlight');
          windowBar.classList.remove('right-highlight');
        }

        if (windowBar === windowBar.parentElement.lastElementChild) {
          if (Math.abs(x - wBPosition.left - windowBar.offsetWidth) < 10 && Math.abs(y - wBPosition.top) < 45) {
            windowBar.classList.add('right-highlight');
          }
        }
      }
    });
  }

  windowBars.forEach((windowBar) => {
    let receiverWindow = undefined;
    let isBarDragged = false;
    const windowBarGhost = document.createElement("div");
    windowBarGhost.classList.add("window-bar");
    windowBarGhost.classList.add("dragging");
    windowBarGhost.innerHTML = windowBar.innerHTML;

    function startResizing(e) {
      if (e.target !== windowBar) return;
      isBarDragged = true;
      body.appendChild(windowBarGhost);
      document.body.style.cursor = "pointer";
    }

    // todo handle adding the element to window management
    function stopResizing() {
      if (!isBarDragged) return;
      isBarDragged = false;
      body.removeChild(windowBarGhost);
      document.body.style.cursor = "default";

      let receiveElement = document.querySelector('.window-bar.left-highlight');
      if (receiveElement) {
        windowBar.parentElement.removeChild(windowBar);
        receiveElement.parentElement.insertBefore(windowBar, receiveElement);
        receiveElement.classList.remove('left-highlight');
        return;
      }
      receiveElement = document.querySelector('.window-bar.right-highlight');
      if (receiveElement) {
        windowBar.parentElement.removeChild(windowBar);
        receiveElement.parentElement.appendChild(windowBar);
        receiveElement.classList.remove('right-highlight');
        return;
      }
    }

    function moveResizing(e) {
      if (!isBarDragged) return;
      windowBarGhost.style.left = `${getPointerPosition(e)}px`;
      windowBarGhost.style.top = `${getPointerPositionY(e)}px`;
      receiverWindow = getReceiverWindow(getPointerPosition(e), getPointerPositionY(e), windowBar);
    }

    windowBar.addEventListener("mousedown", startResizing);
    windowBar.addEventListener("touchstart", startResizing);

    document.addEventListener("mousemove", moveResizing, { passive: false });
    document.addEventListener("touchmove", moveResizing, { passive: false });

    document.addEventListener("mouseup", stopResizing);
    document.addEventListener("touchend", stopResizing);
  });
}
