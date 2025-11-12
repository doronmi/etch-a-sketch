// Initialization
let gridSizeSelectorRange=document.querySelector("#gridSizeSelectorRange");
let gridSizeSelectorSpan=document.querySelector("#gridSizeSelectorSpan");
let gridContainerDiv=document.querySelector("#gridContainerDiv");
let penColorOptions=document.querySelector("#penColorOptions");
let clearGridButton=document.querySelector("#clearGridButton");
let modeSelector=document.querySelector("#modeSelector");

gridSizeSelectorRange.addEventListener("change",userChangedGridSize);
penColorOptions.addEventListener("change",userChangedPenColor);
clearGridButton.addEventListener("click",clearGrid);
modeSelector.addEventListener("change",modeChanged);

const availableColors = ["Black","Grey","Red","Yellow","Green","White","Random"];


let gridSize=25;
let penColor=availableColors[0].toLowerCase();
let mode="addLayer";
gridSizeSelectorRange.min=10;
gridSizeSelectorRange.max=100;
gridSizeSelectorRange.defaultValue=gridSize;
gridSizeSelectorSpan.innerText=gridSizeSelectorRange.value;
fillPenColorSelector(availableColors);
drawGrid(gridSize);


function userChangedGridSize() {
    gridSize=this.value;
    gridSizeSelectorSpan.innerText=gridSize;
    drawGrid(gridSize);
}

function drawGrid(size) {
    //clear the div
    gridContainerDiv.innerHTML="";

    for (let rowNumber=1; rowNumber<=size; rowNumber++) {
        let newRow=document.createElement("div");
        newRow.classList.add("gridRow");        
        
        for (let columnNumber=1; columnNumber<=size; columnNumber++) {
            let newCell=document.createElement("div");
            newCell.classList.add("gridCell");
            newCell.addEventListener("mouseenter",mouseOverCell);
            newRow.appendChild(newCell);
           // console.log(`added cell `+columnNumber);
        }
        gridContainerDiv.appendChild(newRow);
        //console.log(`added row `+rowNumber);  
    }
}

function fillPenColorSelector(colorsArray) {
    penColorOptions.innerHTML="";
    for (color of colorsArray) {
        let newColorOption=document.createElement("option");
        newColorOption.value=color;
        newColorOption.innerText=color;
        penColorOptions.appendChild(newColorOption);
    };
}

function userChangedPenColor() {
    penColor=this.value.toLowerCase();
    console.log(`penColor: ${penColor}`);
    if(penColor==="random") {
        let newColor=pickRandomColor(availableColors);
        console.log(`new color is `+newColor);
        return newColor;
    }
}

function pickRandomColor(colorsArray) {
    let onlyColors=[...colorsArray];
    onlyColors.pop; //remove the random option
    let len = onlyColors.length;
    let indexToChose=Math.floor(Math.random()*len);
    console.log(`indexToChose=`+indexToChose);
    return onlyColors[indexToChose];
}

function mouseOverCell(e) {
    let targetCell=e.target;
    console.log(`"target cell is `+targetCell);
    let currentColor = targetCell.style.backgroundColor;
    console.log(`"currentColor is `+currentColor);
    let newColor = nextColor(currentColor);   

    targetCell.style.backgroundColor=newColor;
}

function clearGrid () {
    let allGridCells = gridContainerDiv.querySelectorAll(".gridCell");
    allGridCells.forEach( div => {
        div.style.backgroundColor="white";
    }); 
}

function modeChanged () {
    let selectedMode = document.querySelector("input[name='mode']:checked");
    mode=selectedMode.value;
    console.log(`mode: `+mode);
}

function nextColor(currentColor) {
    
    let newCellColor= (penColor==="random")? 
            pickRandomColor(availableColors) : penColor;
    
    
    if (mode==="overwrite") {
        return newCellColor;
    } else if (mode==="eraser") {
        return "white";
    } else { // AddLayer mode

        //create temp DIV
        let colorAssistDiv=document.createElement("div");
        document.body.appendChild(colorAssistDiv);

        //convert color from name to RGBA for current cell's color
        colorAssistDiv.style.backgroundColor=currentColor;
        let currentCellRGBcolor = window.getComputedStyle(colorAssistDiv).backgroundColor;
        console.log(`current cell RGB Color: `+currentCellRGBcolor);
        let currentCellRGBAcolor=convertToRGBA(currentCellRGBcolor);
        console.log(`current cell RGBA Color: `+currentCellRGBAcolor);

        //get RGBA for 10% of new cell's color and 
        colorAssistDiv.style.backgroundColor=newCellColor;
        let newLayerRGBcolor = window.getComputedStyle(colorAssistDiv).backgroundColor;
        console.log(`new layer RGB Color before opacity: `+newLayerRGBcolor);

        let newLayerRGBAcolor = convertToRGBA(newLayerRGBcolor);
        console.log(`new layer RGBA Color before opacity: `+newLayerRGBAcolor);

        let newLayerRGBAcolorAfterOpacity = convertToRGBA(newLayerRGBAcolor,0.1)
        console.log(`new layer RGBA Color AFTER opacity: `+newLayerRGBAcolorAfterOpacity);
        
        // get 10% of  let newColorLayer =  
        document.body.removeChild(colorAssistDiv);

        let mixedColor=mixColors(currentCellRGBAcolor,newLayerRGBAcolorAfterOpacity);
        console.log(`mixedColor = `+mixedColor);

        return mixedColor;

    }
    

}

function convertToRGBA(currentColor, alpha) {
    // Parse the RGB/RGBA string
    const rgbaMatch = currentColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    console.log(`rgbaMatch = `+rgbaMatch);
    if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1]);
        const g = parseInt(rgbaMatch[2]);
        const b = parseInt(rgbaMatch[3]);
        const a = (alpha<1) ? alpha  
                    : (rgbaMatch[4]) ? parseFloat(rgbaMatch[4])
                        : 1; // Use provided alpha otherwise use existing, otherwise default to 1

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
        // Handle cases where the color name might not be recognized or is invalid
        console.warn(`Could not convert color name "${colorName}" to RGBA.`);
        return null;
    }
}

function mixColors(colorA,colorB) {
    
    let arrayA = colorA.substring(5, colorA.length-1).split(',');
    console.log("argbArrayColorA = "+arrayA);

    let arrayB = colorB.substring(5, colorB.length-1).split(',');
    console.log("argbArrayColorB = "+arrayB);

    const redA = +arrayA[0];
    const greenA = +arrayA[1];
    const blueA = +arrayA[2];
    const alphaA = +arrayA[3];
    const redB = +arrayB[0];
    const greenB = +arrayB[1];
    const blueB = +arrayB[2];
    const alphaB = +arrayB[3];

    //avoid mixing of white (255,255,255) (which returns white, so user cannot paint on erased cells). 
    // If one color is white, return the other one
    if (redA*greenA*blueA===16581375) return colorB;
    if (redB*greenB*blueB===16581375) return colorA;


    let alphaRES = Math.round((alphaA + alphaB*(1-alphaA))*100)/100;
    console.log(`alphaRES=`+alphaRES);

    let redRES = Math.floor((redA*alphaA + redB*alphaB*(1-alphaA))/alphaRES);
    console.log(`redRES=`+redRES);

    let greenRES = Math.floor((greenA*alphaA + greenB*alphaB*(1-alphaA))/alphaRES);
    console.log(`greenRES=`+greenRES);

    let blueRES = Math.floor((blueA*alphaA + blueB*alphaB*(1-alphaA))/alphaRES);
    console.log(`blueRES=`+blueRES);

    let resRGBA = "rgba("+redRES+","+greenRES+","+blueRES+","+alphaRES+")";
    console.log(`resRBA=`+resRGBA);

    return resRGBA;

}