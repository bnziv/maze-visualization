import { Maze, Cell } from "../maze/Maze";

export function dfs(maze: Maze) {
    if (!maze.startCell || !maze.endCell) return;
    maze.reset()

    const stack: Cell[] = [];
    const path: Cell[] = [];
    let cell: Cell = maze.startCell!;

    stack.push(cell);
    path.push(cell);

    while (stack.length > 0) {
        cell = stack.pop()!;
        cell.visited = true;

        if (cell === maze.endCell) {
            path.push(cell);
            break;
        }

        const neighbors = maze.getNeighbors(cell);
        if (neighbors.length > 0) {
            stack.push(cell);
            path.push(cell);

            const nextCell = neighbors.pop()!;
            stack.push(nextCell);
        } else {
            path.pop();
        }
    }
    path.forEach(cell => cell.path = true);
}