import Grid from './grid.js'

console.log("Initializing...");
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')
const updateGridForm: HTMLFormElement = document.getElementById('updateGridForm') as HTMLFormElement
var canvasOffset = {top:canvas.offsetTop, left:canvas.offsetLeft}
let rowCount: number = 10
let colCount: number = 10
let grid: Grid = new Grid(canvas, rowCount, colCount)
let fpsTimeout = 1000 / 60

window.addEventListener('mousemove', (e) => {
    let mousePosition = {
        x: e.x - canvasOffset.left,
        y: e.y - canvasOffset.top
    }
    grid.checkNodeCollision(mousePosition);
})

window.addEventListener('mouseup', (e) => {
    grid.markNode();
})

function updateGrid(e:SubmitEvent){
    let formData = new FormData(updateGridForm)
    let newColCount = formData.get('colCountInput')
    let newRowCount = formData.get('rowCountInput')
    grid.rowCount = +newRowCount
    grid.colCount = +newColCount
    grid.build()
}

updateGridForm.onsubmit = (e) => {
    e.preventDefault()
    updateGrid(e)
}

function setupGrid(){
    ctx.fillStyle = "darkgray"
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    
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





