import { Maze, Cell } from "../maze/Maze";

export function* aStar(maze: Maze) {
    if (!maze.startCell || !maze.endCell) return;
    maze.reset()

    const heuristic = (cell: Cell) => {
        return Math.abs(cell.x - maze.endCell!.x) + Math.abs(cell.y - maze.endCell!.y);
    }

    const open: Cell[] = [maze.startCell];
    const gScore = new Map<Cell, number>(); // Distance from start to current cell
    const fScore = new Map<Cell, number>(); // fScore = gScore + heuristic
    
    gScore.set(maze.startCell, 0);
    fScore.set(maze.startCell, heuristic(maze.startCell));

    while (open.length > 0) {
        open.sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity));
        const current = open.shift()!;

        maze.currentCell = current;

        if (current === maze.endCell) {
            maze.tracePath();
            break;
        }

        current.visited = true;

        for (const neighbor of maze.getNeighbors(current)) {
            const totalGScore = (gScore.get(current) ?? Infinity) + 1;
            
            if (totalGScore < (gScore.get(neighbor) ?? Infinity)) { // Shorter path
                neighbor.previous = current;
                gScore.set(neighbor, totalGScore);
                fScore.set(neighbor, totalGScore + heuristic(neighbor));
                if (!open.includes(neighbor)) {
                    open.push(neighbor);
                }
            }
        }
        yield maze;
    }

    yield maze;
}