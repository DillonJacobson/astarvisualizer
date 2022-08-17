import GridNode from "./gridNode"

export default class GridNodeHeap{

    nodes: Array<GridNode>

    constructor(items: Array<GridNode>){
        this.nodes = items
    }

    /**
     * Add a node to the bottom of the heap and sort into place
     * 
     * @param {GridNode} item Node to add to the Heap
     */
    insert(item: GridNode){
        this.sortUp(this.nodes.push(item) - 1)
    }

    /**
     * 
     * @returns {GridNode} Best node
     */
    getBestNode(){
        var bestNode = this.nodes[0]
        if (this.nodes.length > 1){
            this.nodes[0] = this.nodes.pop()
            if (this.nodes[0] && this.nodes.length > 1) this.sortDown()
        } else this.nodes = []
        return bestNode
    }

    /**
     * Sort a node upward in the heap
     * 
     */
    sortUp(nodeHeapIndex: number){
        let current = nodeHeapIndex
        let next = Math.floor(nodeHeapIndex / 2)
        if (next < 0) return

        while (this.compare(this.nodes[current],this.nodes[next]) > 0){
            // Swap the nodes
            [this.nodes[next], this.nodes[current]] = [this.nodes[current], this.nodes[next]]

            // Swap the index reference on the nodes
            this.nodes[next].heapIndex = current
            current = this.nodes[current].heapIndex = next
            next = Math.floor(current / 2)
        }
    }

    /**
     * Sort the top node down in the heap
     * 
     */
    sortDown(){
        var current = 0
        var childLeft = 1
        var childRight = 2
        while (this.nodes[childLeft]){
            var swapIndex = childLeft
            // Right node exists, check first
            if (this.nodes.length > childRight && this.compare(this.nodes[childLeft], this.nodes[childRight]) < 0){ 
                swapIndex = childRight
            }

            // Current node is lower priority, move down
            if (this.compare(this.nodes[current], this.nodes[swapIndex]) < 0){
                // Swap the nodes
                [this.nodes[current], this.nodes[swapIndex]] = [this.nodes[swapIndex], this.nodes[current]]

                // Swap the index reference on the nodes
                this.nodes[swapIndex].heapIndex = current 
                current = this.nodes[current].heapIndex = swapIndex
                childLeft = Math.floor(swapIndex * 2) + 1
                childRight = childLeft + 1
            } else break;
        }
    }

    /**
     * Compare two nodes to determine priority in the stack
     * 
     * @param nodeA GridNode
     * @param nodeB GirdNode
     * @returns 1 if nodeA is higher priority, 0 if neutral priority, -1 if nodeB is higher priority
     */
    compare(nodeA: GridNode, nodeB: GridNode){
        if(nodeA.fCost == nodeB.fCost){
            if(nodeA.hCost == nodeB.hCost){
                return 0
            } else if (nodeA.hCost < nodeB.hCost) {
                return 1
            } else {
                return -1
            }
        } else if(nodeA.fCost < nodeB.fCost) {
            return 1
        } else {
            return -1
        }
    }

    /**
     * @breif Check if the node exists in the heap
     * @param searchNode Node to find
     * @returns If node was found true, else false
     */
    hasNode(searchNode:GridNode){
        return this.nodes.some((node) => {
            if(searchNode.gridX === node.gridX && searchNode.gridY === node.gridY){
                console.log(`${searchNode} found in open set.`)
                return true
            }
        })
    }
}