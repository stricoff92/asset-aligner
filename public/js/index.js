
console.log("Hello from index.js!")

const dataCookieName = "assetalignerdata";
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
    configInput.style.fontSize = "1.1rem";
    configInput.spellcheck = false;
    controlPanel.appendChild(configInput);
    controlPanel.appendChild(document.createElement("br"));
    const runConfigButton = document.createElement("button");
    runConfigButton.id = runConfigButtonId;
    runConfigButton.style.fontSize = "1.1rem";
    runConfigButton.style.backgroundColor = "#0f0";
    runConfigButton.style.margin = "0.5rem";
    runConfigButton.textContent = "Run Config (ctrl+enter)";
    controlPanel.appendChild(runConfigButton);

    pageContainer.appendChild(canvas);
    pageContainer.appendChild(controlPanel);
}

// CONFIG RENDERING ///////////////////////////////////
async function runConfig() {
    const text = document.getElementById(configInputId);
    const clean = line => line.trim().replace(/\s+/g, ' ');
    const configLines = text.value.split("\n").map(clean).filter(line => line.length > 0);
    console.log({ configLines });
    if(!configLines.length) return;
    console.log("setting cookie with data " + text.value)
    localStorage.setItem(dataCookieName, text.value);

    const ctx = document.getElementById(canvasId).getContext("2d");
    ctx.clearRect(0, 0, canvasW, canvasH);
    let anyErrors = false;

    // Parse config
    // Required
    let mupm;
    let assetFileName;
    let assetWidthMeters, assetHeightMeters;
    let rotationDegrees = 0.0;

    // Optional
    let addCenterDot;
    let centerDotColor = "#f00";
    let addScaleBar = false;
    const refDots = [];

    for(let i = 0; i < configLines.length; i++) {
        const line = configLines[i];

        if(line.startsWith("//")) // comment line
            continue;

        if(line.startsWith("mupm")) {
            mupm = parseInt(line.split(" ")[1]);

        } else if (line.startsWith("assetFileName")) {
            assetFileName = line.split(" ")[1];

        } else if (line.startsWith("assetWidthMeters")) {
            assetWidthMeters = parseFloat(line.split(" ")[1]);

        } else if (line.startsWith("assetHeightMeters")) {
            assetHeightMeters = parseFloat(line.split(" ")[1]);
        }
        // Optional
        else if(line.startsWith("addCenterDot")) {
            addCenterDot = true;
        } else if(line.startsWith("centerDotColor")) {
            centerDotColor = line.split(" ")[1];
        }
        else if(line.startsWith("addScaleBar")) {
            addScaleBar = true;
        }
        else if(line.startsWith("rotationDegrees")) {
            rotationDegrees = parseFloat(line.split(" ")[1]);
        }
        else if (line.startsWith("refDot")) {
            const [x, y, color] = line.split(" ")[1].split(",").map((v, i) => i<2 ? parseFloat(v): v);
            refDots.push({x, y, color});
        }
    }
    console.log({ refDots });

    const isValidInt = v => v &&typeof v !== "undefined" && !isNaN(v) && Number.isInteger(v) && v > 0;
    const isValidFloat = v => v && typeof v !== "undefined" && !isNaN(v) && v > 0;
    const isAnyValidFloat = v => typeof v !== "undefined" && !isNaN(v);
    const isValidFileName = v => v && typeof v !== "undefined" && v.length > 0;
    const isValidColorHex = v => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);

    if(!isValidInt(mupm)) {console.error("mupm not valid"); anyErrors = true;}
    else console.log({ mupm });

    if(!isValidFileName(assetFileName)) {console.error("assetFileName not valid"); anyErrors = true;}
    else console.log({ assetFileName });

    if(!isValidFloat(assetWidthMeters)) {console.error("assetWidthMeters not valid"); anyErrors = true;}
    else console.log({ assetWidthMeters })

    if(!isValidFloat(assetHeightMeters)) {console.error("assetHeightMeters not valid"); anyErrors = true;}
    else console.log({ assetHeightMeters });

    if(!isValidColorHex(centerDotColor)) {console.error("centerDotColor not valid"); anyErrors = true;}
    else console.log({ centerDotColor });

    if(!isAnyValidFloat(rotationDegrees)) {console.error("rotationDegrees not valid"); anyErrors = true;}
    else console.log({ rotationDegrees });

    for(let i=0; i<refDots.length; i++) {
        let refDot = refDots[i];
        if(!isAnyValidFloat(refDot.x)) {console.error(`refDot ${i} x not valid: ${refDot.x}`); anyErrors = true;}
        if(!isAnyValidFloat(refDot.y)) {console.error(`refDot ${i} y not valid: ${refDot.y}`); anyErrors = true;}
        if(!isValidColorHex(refDot.color)) {console.error(`refDot ${i} color not valid`); anyErrors = true;}
    }

    console.log({ anyErrors})
    if(anyErrors) return;

    // Load asset image
    const assetImg = await new Promise((resolve, reject) => {
        const assetImg = new Image();
        assetImg.onload = () => resolve(assetImg);
        assetImg.onerror = () => reject(`file not found: ${assetFileName}`);
        assetImg.src = `/images/${assetFileName}`;
    });
    console.log({ assetImg });

    // Draw asset image
    const assetWidthPixels = assetWidthMeters * mupm;
    const assetHeightPixels = assetHeightMeters * mupm;
    const imgTopLeftCornerCanvasX = canvasW / 2 - assetWidthPixels / 2;
    const imgTopLeftCornerCanvasY = canvasH / 2 - assetHeightPixels / 2;
    console.log({ assetWidthPixels, assetHeightPixels, imgTopLeftCornerCanvasX, imgTopLeftCornerCanvasY });
    ctx.drawImage(
        assetImg,
        imgTopLeftCornerCanvasX,
        imgTopLeftCornerCanvasY,
        assetWidthPixels,
        assetHeightPixels,
    );

    // CENTER DOT
    if(addCenterDot) {
        ctx.beginPath();
        ctx.fillStyle = centerDotColor;
        ctx.arc(canvasW / 2, canvasH / 2, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    // REFERENCING DOTS
    for(let i=0; i<refDots.length; i++) {
        const refDot = refDots[i];
        const pX = (canvasW / 2) + refDot.x * mupm * assetWidthMeters;
        const pY = (canvasH / 2) - refDot.y * mupm * assetHeightMeters;
        ctx.beginPath();
        ctx.fillStyle = refDot.color;
        ctx.arc(pX, pY, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    // SCALE BAR
    if(addScaleBar) {
        const scaleBarHeightPx = 5;
        const scaleBarWidthPx = canvasW / 3.4;
        const scaleBarMeters = (scaleBarWidthPx / mupm).toFixed(4);
        const scaleBarYOffset = canvasH - 10;
        const scaleBarXOffset = 20;
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.fillRect(scaleBarXOffset, scaleBarYOffset, scaleBarWidthPx, scaleBarHeightPx);
        ctx.font = "16px Arial";
        ctx.fillText(`${scaleBarMeters}m`, scaleBarXOffset, scaleBarYOffset - 5);
    }

}


function main() {
    addHTMLElements();

    const config = localStorage.getItem(dataCookieName);
    if(config)
        document.getElementById(configInputId).value = config;
    else
        console.log("no config found in cookie");


    document.getElementById(runConfigButtonId).addEventListener("click", runConfig);
    document.addEventListener("keydown", e => {
        if(e.key === "Enter" && e.ctrlKey) runConfig();
    });
}
document.addEventListener("DOMContentLoaded", main);
