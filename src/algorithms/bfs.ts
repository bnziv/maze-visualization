import { Maze, Cell } from "../maze/Maze";

export function bfs(maze: Maze) {
    if (!maze.startCell || !maze.endCell) return;
    maze.reset()

    const queue: Cell[] = [];
    const parentMap = new Map<Cell, Cell | null>();

    let cell: Cell = maze.startCell!;
    queue.push(cell);
    parentMap.set(cell, null);

    while (queue.length > 0) {
        cell = queue.shift()!;
        cell.visited = true;

        if (cell === maze.endCell) {
            reconstructPath(parentMap, cell);
            break;
        }

        for (const neighbor of maze.getNeighbors(cell)) {
            queue.push(neighbor);
            parentMap.set(neighbor, cell);
        }
    }
}

function reconstructPath(parentMap: Map<Cell, Cell | null>, cell: Cell) {
    let path: Cell[] = [];
    let current: Cell | null = cell;

    while (current) {
        path.push(current);
        current = parentMap.get(current) || null;
    }

    path.forEach(cell => cell.path = true);
}