
console.log("Hello from index.js!")

const canvasId = "display-canvas";
const controlPanelId = "control-panel";
const containerId = "page-container";
const DISPLAY_FORMAT_HORIZONTAL = "horizontal";
const DISPLAY_FORMAT_VERTICAL = "vertical";

let canvasW, canvasH;

function addHTMLElements() {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    console.log({ windowW, windowH });
    const canvas = document.createElement("canvas");
    canvas.id = canvasId;
    canvas.style.border = "1px solid #0f0";
    const controlPanel = document.createElement("div");
    controlPanel.id = controlPanelId;
    controlPanel.style.border = "1px solid #f00";

    const displayFormat = windowW > windowH ? DISPLAY_FORMAT_HORIZONTAL : DISPLAY_FORMAT_VERTICAL;
    console.log({ displayFormat });
    const pageContainer = document.getElementById(containerId);
    if(displayFormat === DISPLAY_FORMAT_HORIZONTAL) {
        pageContainer.style.display = "flex";
        pageContainer.style.flexDirection = "row";

        canvasH = Math.floor(windowH * 0.9);
        canvasW = Math.floor(windowW / 2);
        canvas.style.width = `${ canvasW }px`;
        canvas.width = canvasW;
        canvas.style.height = `${ canvasH }px`;
        canvas.height = canvasH;
        controlPanel.style.width = `${ canvasW }px`;
        controlPanel.style.height = `${ canvasH }px`;

    } else if (displayFormat === DISPLAY_FORMAT_VERTICAL) {
        canvas.style.width = "100%"
        canvasW = windowW;
        canvas.width = canvasW;
        canvasH = Math.floor(windowH / 2.2);
        canvas.style.height = `${ canvasH }px`;
        canvas.height = canvasH;
        controlPanel.style.width = "100%";
        controlPanel.style.height = `${ canvasH }px`;

    } else
        throw new Error("Invalid display format");

    pageContainer.appendChild(canvas);
    pageContainer.appendChild(controlPanel);



}


function main() {
    addHTMLElements();
}
document.addEventListener("DOMContentLoaded", main);
