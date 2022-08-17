export interface CurrentAction{
    setStart: boolean,
    setEnd: boolean,
    setCheckpoint: boolean,
    setBlocked: boolean,
    resetNode: boolean
}

export interface Position{
    x:number,
    y:number
}

export interface Box {
    position:Position
    width:number,
    height:number
}

export function CheckBoxCollision(box:Box, position:Position){
    return (position.x >= box.position.x && 
            position.x < box.position.x + box.width &&
            position.y >= box.position.y && 
            position.y < box.position.y + box.height)
}


export async function sleep(ms:number){
    return new Promise(r => setTimeout(r, ms))
}