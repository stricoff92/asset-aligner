
console.log("Hello from index.js!")

const canvasId = "display-canvas";
const containerId = "page-container";
const DISPLAY_FORMAT_HORIZONTAL = "horizontal";
const DISPLAY_FORMAT_VERTICAL = "vertical";

function addHTMLElements() {

    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const canvas = document.createElement("canvas");
    canvas.id = canvasId;
    const controlPanel = document.createElement("div");

    const displayFormat = windowW > windowH ? DISPLAY_FORMAT_HORIZONTAL : DISPLAY_FORMAT_VERTICAL;
    console.log({ displayFormat });
    const pageContainer = document.getElementById(containerId);
    pageContainer.style.display = "flex";



}


function main() {
    addHTMLElements();
}
document.addEventListener("DOMContentLoaded", main);
