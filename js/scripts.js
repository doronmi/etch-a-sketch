// Initialization
let gridSizeSelectorRange=document.querySelector("#gridSizeSelectorRange");
let gridSizeSelectorSpan=document.querySelector("#gridSizeSelectorSpan");
let gridContainerDiv=document.querySelector("#gridContainerDiv");
let penColorOptions=document.querySelector("#penColorOptions");
let clearGridButton=document.querySelector("#clearGridButton");

gridSizeSelectorRange.addEventListener("change",userChangedGridSize);
penColorOptions.addEventListener("change",userChangedPenColor);
clearGridButton.addEventListener("click",clearGrid);

const availableColors = ["Black","Grey","Red","Yellow","Green","Random"];


let gridSize=16;
let penColor=availableColors[0].toLowerCase();
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
            console.log(`added cell `+columnNumber);
        }
        gridContainerDiv.appendChild(newRow);
        console.log(`added row `+rowNumber);  
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
    let cellColor= (penColor==="random")? 
        pickRandomColor(availableColors)
        : penColor;
    targetCell.style.backgroundColor=cellColor;
}

function clearGrid () {
    let allGridCells = gridContainerDiv.querySelectorAll(".gridCell");
    allGridCells.forEach( div => {
        div.backgroundColor="white";
    }); 
}