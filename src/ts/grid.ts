import GridNode from "./gridNode.js"
import GridNodeHeap from "./heap.js"
import { CurrentAction, Position, sleep } from "./utils.js"

export default class Grid{

    canvas: HTMLCanvasElement
    nodeSize: number = 50
    colCount: number
    rowCount: number
    nodes: Array<Array<GridNode>> = [[]]
    openNodeHeap: GridNodeHeap
    checkPoints: Array<GridNode> = []
    pathNodes: Array<GridNode> = []
    startNode: GridNode
    endNode: GridNode
    pausePath: boolean = false
    pathComplete: boolean = true
    allowDiagonal: boolean = true

    constructor(
        canvas: HTMLCanvasElement, nodeSize? : number
    ){
        this.canvas = canvas
        this.nodeSize = nodeSize || this.nodeSize
    }

    build(){
       
        let yOffset = 0
        let xOffset = 0
        this.colCount = Math.floor(this.canvas.width / this.nodeSize)
        this.rowCount = Math.floor(this.canvas.height / this.nodeSize)
        this.nodes = [[]]
        xOffset = (this.canvas.width - this.colCount * this.nodeSize) / 2
        yOffset = (this.canvas.height - this.rowCount * this.nodeSize) / 2
        for (var x = 0; x < this.colCount; x++){
            for (var y = 0; y < this.rowCount; y++){
                this.nodes[x].push(new GridNode(x, y, this.nodeSize, xOffset, yOffset))
            }
            this.nodes.push([])
        }
    }

    reset(){
        // Clear node flags from previous runs
        this.nodes.forEach((row) => {
            row.forEach((node)=> {
                if (node === this.startNode){
                    node.resetFlags()
                    node.isStart = true
                }
                else if(node === this.endNode){
                    node.resetFlags()
                    node.isEnd = true
                }
                else if(node.isBlocked){
                    node.resetFlags()
                    node.isBlocked = true
                }
                else{
                    node.resetFlags()
                }
            })
        })
        // Clear old path data
        this.pathNodes = []
        // Reset the openNodeHeap
        this.openNodeHeap = null
        this.openNodeHeap = new GridNodeHeap([this.startNode])
        this.pausePath = false
        this.pathComplete = false
    }

    togglePausePath(){
        this.pausePath = !this.pausePath
    }

    async findPath(ctx: CanvasRenderingContext2D, delay:number){
        if (!this.startNode || !this.endNode) return alert('Must pick a start and end node!')

        //Reset data from previous runs
        if (this.pathComplete || !this.pausePath){
            this.reset()
            this.pathComplete = false
        }

        while(this.openNodeHeap.nodes.length > 0 && !this.pausePath) {
            // Get the lowest cost node and remove it from the open heap
            var currentNode: GridNode = this.openNodeHeap.getBestNode()
            currentNode.isClosed = true
            currentNode.isOpen = false
            console.table(this.openNodeHeap.nodes, ['gridX', 'gridY', 'gCost', 'hCost', 'fCost'])
            // Path Found
            if (currentNode === this.endNode){
                var currentPathNode = this.endNode
                while (currentPathNode){
                    //TODO Store path to use in future
                    // Current implementation is for display only
                    if (currentPathNode !== this.endNode && currentPathNode !== this.startNode){
                        currentPathNode.resetFlags()
                        currentPathNode.isPath = true
                    }
                    if (currentNode.parentNode)
                        currentPathNode = currentPathNode.parentNode
                    else break;
                }
                console.log("Path found")
                this.pathComplete = true
                break;
            }
            
            this.getNeighbors(currentNode).forEach((neighborNode:GridNode) => {
                if (neighborNode.isClosed || neighborNode.isBlocked) return;
                let costToNeighbor: number = currentNode.gCost + this.getDistanceBetweenNodes(currentNode, neighborNode)
                let isNeighborOpen: boolean = this.openNodeHeap.hasNode(neighborNode)
                if (costToNeighbor < neighborNode.gCost || !isNeighborOpen){
                    neighborNode.gCost = costToNeighbor
                    neighborNode.hCost = this.getDistanceBetweenNodes(neighborNode, this.endNode)
                    neighborNode.parentNode = currentNode

                    if (!isNeighborOpen){
                        this.openNodeHeap.insert(neighborNode)
                        neighborNode.isOpen = true
                    }
                }
            })
            currentNode.clear(ctx)
            currentNode.draw(ctx)
            // Draw grid nodes every second
            await sleep(delay);
        }
    }

    getDistanceBetweenNodes(nodeA: GridNode, nodeB: GridNode){
        let distX = Math.abs(nodeA.gridX - nodeB.gridX)
        let distY = Math.abs(nodeA.gridY - nodeB.gridY)
        if (!this.allowDiagonal){
            return 10*(distX + distY)
        }
        else{
            if (distX > distY) return 14*distY + 10*(distX-distY)
            else return 14*distX + 10*(distY - distX)
        }
    }

    getNeighbors(node:GridNode){
        var neighbors: Array<GridNode> = []
        for (let x = -1; x <= 1; x++){
            for (let y = -1; y <= 1; y++){
                if (x === y && !this.allowDiagonal) continue;
                else if(x === 0 && y === 0 && this.allowDiagonal) continue;
                let xPos = node.gridX + x
                let yPos = node.gridY + y
                if (xPos >= 0 && xPos < this.colCount && yPos >= 0 && yPos < this.rowCount){
                    neighbors.push(this.nodes[xPos][yPos])
                }
            }
        }
        return neighbors
    }

    markNode(currentAction:CurrentAction){
        var hoveredNode: GridNode
        this.nodes.some((row: Array<GridNode>) => {
            return row.some((node: GridNode) => {
                if (node.isHovered) hoveredNode = node
                return hoveredNode
            })
        })
        if (!hoveredNode) return

        hoveredNode.updateState(currentAction)

        // Replace existing start/end node references
        if (currentAction.setStart){
            if(this.startNode) this.startNode.isStart = false;
            this.startNode = hoveredNode
        } else if (currentAction.setEnd){
            if(this.endNode) this.endNode.isEnd = false
            this.endNode = hoveredNode
        }
    }

    /**
     * @breif Checks if any nodes in the grid are hovered
     * 
     * @param {Position} position Mouse position 
     */
    checkNodeHover(position:Position){
        this.nodes.forEach((row: Array<GridNode>) =>{
            row.forEach((node) => {
                node.checkHover(position);
            })
        })
    }

    draw(ctx:CanvasRenderingContext2D){
        this.nodes.forEach((row: Array<GridNode>) => {
            row.forEach((node)=>{
                node.draw(ctx)
            })
        })
    }

    public log_attrs(){
        console.log(`I am a grid with ${this.colCount} columns and ${this.rowCount} rows`)
    }
}