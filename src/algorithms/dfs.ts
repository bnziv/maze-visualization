import { Maze, Cell } from "../maze/Maze";

export function dfs(maze: Maze) {
    if (!maze.startCell || !maze.endCell) return;
    maze.reset()
    const grid = maze.getGrid();

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

        const neighbors = getNeighbors(cell, maze, grid);
        if (neighbors.length > 0) {
            stack.push(cell);
            path.push(cell);

            const nextCell = neighbors.pop()!;
            stack.push(nextCell);
        } else {
            path.pop();
        }
    }
    // Mark the path
    for (cell of path) {
        cell.path = true;
    }
}

function getNeighbors(cell: Cell, maze: Maze, grid: Cell[][]) {
    const neighbors: Cell[] = [];
    const directions = [
        { wall: "top", x: 0, y: -1 },
        { wall: "right", x: 1, y: 0 },
        { wall: "bottom", x: 0, y: 1 },
        { wall: "left", x: -1, y: 0 },
    ];

    for (const { wall, x, y } of directions) {
        if (!cell.walls[wall as keyof typeof cell.walls]) {
            const newY = cell.y + y;
            const newX = cell.x + x;

            if (maze.inBounds(newY, newX) && !grid[newY][newX].visited) {
                neighbors.push(grid[newY][newX]);
            }
        }
    }
    return neighbors;
}