
console.log("Hello from index.js!")

const canvasId = "display-canvas";
const controlPanelId = "control-panel";
const containerId = "page-container";
const configInputId = "config-input";
const runConfigButtonId = "run-config";
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

    } else throw new Error("Invalid display format");

    controlPanel.style.backgroundColor = "#dbdbdb";
    const configInput = document.createElement("textarea");
    configInput.id = configInputId;
    configInput.style.width = "96%";
    configInput.style.height = "80%";
    controlPanel.appendChild(configInput);
    controlPanel.appendChild(document.createElement("br"));
    const runConfigButton = document.createElement("button");
    runConfigButton.id = runConfigButtonId;
    runConfigButton.style.fontSize = "1.4rem";
    runConfigButton.style.backgroundColor = "#0f0";
    runConfigButton.style.margin = "0.5rem";
    runConfigButton.textContent = "Run Config";
    controlPanel.appendChild(runConfigButton);

    pageContainer.appendChild(canvas);
    pageContainer.appendChild(controlPanel);
}

async function runConfig() {
    const text = document.getElementById(configInputId);
    const clean = line => line.trim().replace(/\s+/g, ' ');
    const configLines = text.value.split("\n").map(clean).filter(line => line.length > 0);
    console.log({ configLines });
    if(!configLines.length) return;

    const ctx = document.getElementById(canvasId).getContext("2d");
    ctx.clearRect(0, 0, canvasW, canvasH);
    let anyErrors = false;

    // Parse config
    let mupm;
    let assetFileName;
    let assetWidthMeters, assetHeightMeters;
    for(let i = 0; i < configLines.length; i++) {
        const line = configLines[i];
        if(line.startsWith("mupm")) {
            mupm = parseInt(line.split(" ")[1]);

        } else if (line.startsWith("assetFileName")) {
            assetFileName = line.split(" ")[1];

        } else if (line.startsWith("assetWidthMeters")) {
            assetWidthMeters = parseFloat(line.split(" ")[1]);

        } else if (line.startsWith("assetHeightMeters")) {
            assetHeightMeters = parseFloat(line.split(" ")[1]);
        }
    }
    const isValidInt = v => v &&typeof v !== "undefined" && !isNaN(v) && Number.isInteger(v) && v > 0;
    const isValidFloat = v => v && typeof v !== "undefined" && !isNaN(v) && v > 0;
    const isValidFileName = v => v && typeof v !== "undefined" && v.length > 0;
    if(!isValidInt(mupm)) {console.error("mupm not valid"); anyErrors = true;}
    else console.log({ mupm });
    if(!isValidFileName(assetFileName)) {console.error("assetFileName not valid"); anyErrors = true;}
    else console.log({ assetFileName });
    if(!isValidFloat(assetWidthMeters)) {console.error("assetWidthMeters not valid"); anyErrors = true;}
    else console.log({ assetWidthMeters })
    if(!isValidFloat(assetHeightMeters)) {console.error("assetHeightMeters not valid"); anyErrors = true;}
    else console.log({ assetHeightMeters });
    if(anyErrors) return;

    // Load asset image
    const assetImg = await new Promise((resolve, reject) => {
        const assetImg = new Image();
        assetImg.onload = () => resolve(assetImg);
        assetImg.onerror = () => reject(`file not found: ${assetFileName}`);
        assetImg.src = `/images/${assetFileName}`;
    });

    // Draw asset image
    const assetWidthPixels = Math.floor(assetWidthMeters * mupm);
    const assetHeightPixels = Math.floor(assetHeightMeters * mupm);
    const imgTopLeftCornerCanvasX = canvasW / 2 - assetWidthPixels / 2;
    const imgTopLeftCornerCanvasY = canvasH / 2 - assetHeightPixels / 2;
    console.log({ assetWidthPixels, assetHeightPixels, imgTopLeftCornerCanvasX, imgTopLeftCornerCanvasY });
    ctx.drawImage(assetImg, imgTopLeftCornerCanvasX, imgTopLeftCornerCanvasY, assetWidthPixels, assetHeightPixels);

}


function main() {
    addHTMLElements();
    document.getElementById(runConfigButtonId).addEventListener("click", runConfig);
}
document.addEventListener("DOMContentLoaded", main);
