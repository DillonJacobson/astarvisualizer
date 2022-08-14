import GridNode from "./gridNode.js"
import { Position } from "./utils.js"

export default class Grid{

    canvas: HTMLCanvasElement
    rowCount: number
    colCount: number
    nodes: Array<GridNode> = []

    constructor(
        canvas: HTMLCanvasElement,
        rowCount: number,
        colCount: number,
    ){
        this.canvas = canvas
        this.rowCount = rowCount
        this.colCount = colCount
    }

    build(){
        let startY = 0
        let startX = 0
        let nodeWidth = this.canvas.width / this.colCount
        let nodeHeight = this.canvas.height / this.rowCount
        console.log(this.colCount, this.rowCount)
        for (var i = 0; i < this.colCount; i++){
            for (var j = 0; j < this.rowCount; j++){
                this.nodes.push(new GridNode(
                    nodeWidth*i + startX, nodeHeight*j + startY, nodeWidth, nodeHeight
                ))
            }
        }
    }

    update(){

    }

    markNode(){
        this.nodes.forEach((node) => {
            node.isHovered ? node.isBlocked = !node.isBlocked : null
        })
    }

    checkNodeCollision(position:Position){
        this.nodes.forEach((node) => {
            node.checkCollision(position);
        })
    }

    draw(ctx:CanvasRenderingContext2D){
        this.nodes.forEach((node)=>{
            node.draw(ctx)
        })
    }

    public log_attrs(){
        console.log(`I am a grid with ${this.colCount} columns and ${this.rowCount} rows`)
    }
}