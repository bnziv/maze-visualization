import { Maze, Cell } from "../maze/Maze";

export function* dfs(maze: Maze) {
    if (!maze.startCell || !maze.endCell) return;
    maze.reset()

    const stack: Cell[] = [];
    let cell: Cell = maze.startCell!;

    stack.push(cell);

    while (stack.length > 0) {
        cell = stack.pop()!;
        cell.visited = true;

        if (cell === maze.endCell) {
            maze.tracePath();
            break;
        }

        for (const neighbor of maze.getNeighbors(cell)) {
            stack.push(cell);
            neighbor.previous = cell;
            stack.push(neighbor);
        }
        yield maze;
    }
    yield maze;
}