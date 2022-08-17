import { CheckBoxCollision, Position, Box, CurrentAction } from "./utils.js"

export default class GridNode implements Box {
    position: Position = {x:0, y:0}
    width: number
    height: number
    collider: object
    gridX: number
    gridY: number
    isHovered: Boolean = false
    isBlocked: Boolean = false
    isClosed: Boolean = false
    isCheckpoint: Boolean = false
    isPath: Boolean = false
    isStart: Boolean = false
    isEnd: Boolean = false
    isOpen: Boolean = false
    heapIndex: number
    parentNode: GridNode
    hCost: number = 0
    gCost: number = 0
    
    /**
     *  @brief Build a GridNode
     * 
     *  @param {number} x - Grid X
     *  @param {number} y - Grid Y
     *  @param {number} size - Size of node in pixels
     *  @param {number} offsetX (optional) Start x position offset Default = 0
     *  @param {number} offsetY (optional) Start y position offset Default = 0
     */
    constructor(x:number, y:number, size:number, offsetX:number=0, offsetY:number=0){
        this.gridX = x;
        this.gridY = y;
        this.position = {
            x: size * x + offsetX,
            y: size * y + offsetY
        };
        this.width = size;
        this.height = size;
    }

    get fCost(){
        return this.hCost + this.gCost
    }

    clear(ctx: CanvasRenderingContext2D){
        ctx.clearRect(this.position.x, this.position.y, this.width, this.height)
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx Canvas context2d
     */
    draw(ctx:CanvasRenderingContext2D){
        ctx.save();
        
        if (this.isBlocked) ctx.fillStyle = "black";
        else if (this.isCheckpoint) ctx.fillStyle = "yellow";
        else if (this.isStart) ctx.fillStyle = "blue";
        else if (this.isEnd) ctx.fillStyle = "orange";
        else if (this.isPath) ctx.fillStyle = "green";
        else if (this.isOpen) ctx.fillStyle = 'purple';
        else if (this.isClosed) ctx.fillStyle = "red";
        else ctx.fillStyle = "lightgray";
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fill();
        if (this.isHovered){
            ctx.fillStyle = "rgba(0,0,0,0.3)";
            ctx.fill();
        }
        ctx.stroke();
        ctx.restore();
    }

    update(){

    }

    /**
     * @breif Checks if the current node is hovered over
     * 
     * @param {Position} position Mouse position
     * 
     * @returns {boolean} True if hovered
     */
    checkHover(position:Position){
        CheckBoxCollision(
            this,
            position
        ) ? this.isHovered = true : this.isHovered = false
    }


    updateState(currentAction:CurrentAction){
        if (currentAction.setBlocked) {
            this.isBlocked = !this.isBlocked
            this.isCheckpoint = false
            this.isStart = false
            this.isEnd = false
        } else if (currentAction.setCheckpoint){
            this.isCheckpoint = !this.isCheckpoint
            this.isBlocked = false
            this.isStart = false
            this.isEnd = false
        } else if (currentAction.setStart){
            this.isStart = !this.isStart
            this.isBlocked = false
            this.isCheckpoint = false
            this.isEnd = false
        } else if (currentAction.setEnd){
            this.isEnd = !this.isEnd
            this.isBlocked = false
            this.isCheckpoint = false
            this.isStart = false
        } else if (currentAction.resetNode){
            this.resetFlags()
        }
    }

    resetFlags(){
        this.isBlocked = false
        this.isCheckpoint = false
        this.isEnd = false
        this.isStart = false
        this.isPath = false
        this.isOpen = false
        this.isClosed = false
    }
}