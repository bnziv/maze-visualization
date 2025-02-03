import { Maze, Cell } from "../maze/Maze";

export function* bfs(maze: Maze) {
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
        
        maze.currentCell = cell;

        if (cell === maze.endCell) {
            maze.tracePath();
            break;
        }

        for (const neighbor of maze.getNeighbors(cell)) {
            neighbor.previous = cell;
            queue.push(neighbor);
            parentMap.set(neighbor, cell);
        }
        yield maze;
    }
    yield maze;
}