class Cell {
    x: number;
    y: number;
    visited: boolean = false;
    path: boolean = false;
    previous: Cell | null = null;
    walls: { top: boolean, right: boolean, bottom: boolean, left: boolean } = {
        top: true,
        right: true,
        bottom: true,
        left: true
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    clone() {
        const clone = new Cell(this.x, this.y);
        clone.visited = this.visited;
        clone.path = this.path;
        clone.walls = { ...this.walls };
        return clone;
    }
}

class Maze {
    public rows: number;
    public cols: number;
    private grid: Cell[][];
    public startCell: Cell | null = null;
    public endCell: Cell | null = null;
    public currentCell: Cell | null = null;

    constructor(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.grid = new Array(rows).fill(null).map((_, y) => 
            new Array(cols).fill(null).map((_, x) => new Cell(x, y))
        );
    }

    generateRecursiveBacktracking() {
        const stack: Cell[] = [];
        const start: Cell = this.grid[Math.floor(Math.random() * this.rows)][Math.floor(Math.random() * this.cols)];
        stack.push(start);
        start.visited = true;

        while (stack.length > 0) {
            const cell = stack.pop()!;
            const neighbors = this.getUnvisitedNeighbors(cell);

            if (neighbors.length > 0) {
                stack.push(cell);
                const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.removeWall(cell, randomNeighbor);
                randomNeighbor.visited = true;
                stack.push(randomNeighbor);
            }
        }
    }

    private getUnvisitedNeighbors(cell: Cell) {
        const neighbors: Cell[] = [];
        const adjacentCells = [
            [cell.y, cell.x - 1], // Left
            [cell.y, cell.x + 1], // Right
            [cell.y - 1, cell.x], // Up
            [cell.y + 1, cell.x], // Down
        ];

        for (const [row, col] of adjacentCells) {
            if (this.inBounds(row, col) && !this.grid[row][col].visited) {
                neighbors.push(this.grid[row][col]);
            }
        }
        return neighbors;
    }

    private removeWall(cell1: Cell, cell2: Cell) {
        if (cell1.x === cell2.x) { // Same column
            if (cell1.y < cell2.y) { //Cell1 is above
                cell1.walls.bottom = false;
                cell2.walls.top = false;
            } else { // Cell1 is below
                cell1.walls.top = false;
                cell2.walls.bottom = false;
            }
        } else if (cell1.y === cell2.y) { // Same row
            if (cell1.x < cell2.x) { // Cell1 is to the left
                cell1.walls.right = false;
                cell2.walls.left = false;
            } else { // Cell1 is to the right
                cell1.walls.left = false;
                cell2.walls.right = false;
            }
        }
    }

    /**
     * Returns an array of possible unvisited neighbors for a cell
     * @param cell
     * @returns
     */
    getNeighbors(cell: Cell, randomize: boolean = false) {
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
    
                if (this.inBounds(newY, newX) && !this.grid[newY][newX].visited) {
                    neighbors.push(this.grid[newY][newX]);
                }
            }
        }
        if (randomize) {
            neighbors.sort(() => Math.random() - 0.5);
        }
        return neighbors;
    }

    inBounds(row: number, col: number) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    setStartCell(cell: Cell) {
        this.startCell = cell;
    }

    setEndCell(cell: Cell) {
        this.endCell = cell;
    }

    reset() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j].visited = false;
                this.grid[i][j].path = false;
            }
        }
    }

    getGrid(): Cell[][] {
        return this.grid;
    }

    clone() {
        const maze = new Maze(this.rows, this.cols);
        maze.grid = this.grid.map(row => row.map(cell => cell.clone()));
        maze.startCell = maze.grid[this.startCell!.y][this.startCell!.x];
        maze.endCell = maze.grid[this.endCell!.y][this.endCell!.x];
        return maze;
    }

    tracePath() {
        let currentCell: Cell | null = this.endCell;
        while (currentCell != null) {
            currentCell.path = true;
            currentCell = currentCell.previous;
        }
    }

    generateKruskalsMaze() {
        // Create a set for each cell and add each cell to its own set
        const sets = new Map<Cell, Set<Cell>>();
        this.grid.flat().forEach(cell => sets.set(cell, new Set([cell])));
    
        // Create a list of all walls
        const edges: { cell1: Cell; cell2: Cell }[] = [];
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cell = this.grid[y][x];
                if (x < this.cols - 1) edges.push({ cell1: cell, cell2: this.grid[y][x + 1] }); // Right neighbor
                if (y < this.rows - 1) edges.push({ cell1: cell, cell2: this.grid[y + 1][x] }); // Bottom neighbor
            }
        }
    
        // For each wall in random order
        edges.sort(() => Math.random() - 0.5);
        for (const { cell1, cell2 } of edges) {
            const set1 = sets.get(cell1)!;
            const set2 = sets.get(cell2)!;
    
            if (set1 !== set2) { // In distinct sets
                this.removeWall(cell1, cell2);
    
                // Merge the two sets
                const mergedSet = new Set([...set1, ...set2]);
                mergedSet.forEach(cell => sets.set(cell, mergedSet));
            }
        }
    }        
}

export { Cell, Maze };