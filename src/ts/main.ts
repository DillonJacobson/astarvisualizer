import Grid from './grid.js'

console.log("Initializing...");
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
const updateGridForm: HTMLFormElement = document.getElementById('updateGridForm') as HTMLFormElement
const actionSelectInput: HTMLSelectElement = document.getElementById('actionSelect') as HTMLSelectElement
const findPathButton: HTMLButtonElement = document.getElementById('findPath') as HTMLButtonElement
const resetPathButton: HTMLButtonElement = document.getElementById('resetPath') as HTMLButtonElement
const pausePathButton: HTMLButtonElement = document.getElementById('pausePath') as HTMLButtonElement
const updateSettingsButton: HTMLButtonElement = document.getElementById('updateSettingsButton') as HTMLButtonElement
const delayDisplaySpan: HTMLSpanElement = document.getElementById('delayDisplay') as HTMLSpanElement
const nodeSizeDisplaySpan: HTMLSpanElement = document.getElementById('nodeSizeDisplay') as HTMLSpanElement
var canvasOffset = {top:canvas.offsetTop, left:canvas.offsetLeft}
let grid: Grid = new Grid(canvas)
let fpsTimeout = 1000 / 60
let pathStepDelayMS = 1000

var currentAction = {
    setStart: true,
    setEnd: false,
    setCheckpoint: false,
    setBlocked: false,
    resetNode: false
}

window.addEventListener('resize', (e) =>{
    canvasOffset = {top:canvas.offsetTop, left:canvas.offsetLeft}
})

window.addEventListener('mousemove', (e) => {
    let mousePosition = {
        x: e.x - canvasOffset.left,
        y: e.y - canvasOffset.top
    }
    grid.checkNodeHover(mousePosition);
})

window.addEventListener('mouseup', (e) => {
    grid.markNode(currentAction);
})

function applyFormControls(e:SubmitEvent){
    let formData = new FormData(updateGridForm)
    let nodeSize = formData.get('nodeSize')
    let delay = formData.get('delaySeconds')
    let allowDiagonal = formData.get('allowDiagonal')
    if (allowDiagonal !== null) grid.allowDiagonal = true
    else grid.allowDiagonal = false
    if (grid.nodeSize !== +nodeSize) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        grid.nodeSize = +nodeSize
        grid.build()
    } else {
        grid.reset()
    }
    pathStepDelayMS = +delay * 1000
    nodeSizeDisplaySpan.textContent = nodeSize.toString()
    delayDisplaySpan.textContent = delay.toString()
}

updateGridForm.onsubmit = (e) => {
    e.preventDefault()
    applyFormControls(e)
}

actionSelectInput.onchange = (e) => {
    for (let action in currentAction){
        if (actionSelectInput.value === action) currentAction[action] = true
        else currentAction[action] = false
    }
    console.table(currentAction)
}

findPathButton.onclick = async (e) => {
    beginFindPath()
}

pausePathButton.onclick = (e) => {
    grid.togglePausePath()
    if (!grid.pausePath){
        pausePathButton.textContent = 'Pause'
        beginFindPath()
    } else pausePathButton.textContent = 'Unpause'
}

resetPathButton.onclick = (e) => {
    grid.reset()
    pausePathButton.textContent = 'Pause'
}

function beginFindPath(){
    updateSettingsButton.disabled = true
    grid.findPath(ctx, pathStepDelayMS)
    updateSettingsButton.disabled = false
}

function setupGrid(){
    ctx.fillStyle = "darkgray"
    ctx.strokeStyle = "white"
    ctx.lineWidth = 0.5
    
    grid.build()
}

function run(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    grid.draw(ctx)
    setTimeout(()=> {
        window.requestAnimationFrame(run)
    }, fpsTimeout) 
}

setupGrid()
run()





