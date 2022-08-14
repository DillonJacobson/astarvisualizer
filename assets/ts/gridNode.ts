import { CheckBoxCollision, Position, Box } from "./utils.js"

export default class GridNode implements Box {
    position: Position = {x:0, y:0}
    width: number
    height: number
    collider: object
    isHovered: Boolean = false
    isBlocked: Boolean = false
    isCheckpoint: Boolean = false
    isPath: Boolean = false
    
    constructor(x:number, y:number, width:number, height:number){
        this.position = {
            x: x,
            y: y,
        },
        this.width = width
        this.height = height
        this.collider =  {

            width: this.width,
            height: this.height
        }
    }

    draw(ctx:CanvasRenderingContext2D){
        ctx.save()
        if (this.isHovered) ctx.fillStyle = "green";
        else if (this.isBlocked) ctx.fillStyle = "red";

        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();
        ctx.restore()
    }

    update(){

    }

    checkCollision(position:Position){
        CheckBoxCollision(
            this,
            position
        ) ? this.isHovered = true : this.isHovered = false
    }

}