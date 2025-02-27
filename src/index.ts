import { Maze, Cell } from "./maze/Maze";
import { dfs } from "./algorithms/dfs";
import { bfs } from "./algorithms/bfs";
import { aStar } from "./algorithms/aStar";

const container = document.getElementById("maze-container")!;
container.style.gridTemplateColumns = 'repeat(2, 1fr)';
container.style.gap = '20px';

let startCell: Cell | null = null;
let startCellDiv: HTMLElement | null = null;
let endCell: Cell | null = null;
let endCellDiv: HTMLElement | null = null;

let maze: Maze | null = null;

function renderMaze(maze: Maze, id: string) {
    const grid = maze.getGrid();
    const mazeDiv = document.createElement('div');
    mazeDiv.id = `maze-${id}`;
    mazeDiv.className = 'maze';
    mazeDiv.innerHTML = '';
    mazeDiv.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`;

    grid.forEach(row => {
        row.forEach(cell => {
            const div = document.createElement('div');
            div.className = 'cell';

            // Event listeners for adding start and end
            div.addEventListener('click', () => handleStart(div, cell, maze!));
            div.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                handleEnd(div, cell, maze!);
            });

            renderCell(cell, div);
            if (cell == maze.startCell) div.classList.add('start');
            if (cell == maze.endCell) div.classList.add('end');
            if (cell.visited) div.classList.add('visited');
            if (cell.path) div.classList.add('path');
            mazeDiv.appendChild(div);
        })
    })
    return mazeDiv;
}

function renderCell(cell: Cell, div: HTMLElement) {
    const wallPositions = ['top', 'right', 'bottom', 'left'];
    wallPositions.forEach(position => {
        if ((cell.walls as any)[position]) {
            const wall = document.createElement('div');
            wall.className = `${position}-wall`;
            div.appendChild(wall);
        }
    })

    // Corners to fix up styling
    const cornerTopLeft = document.createElement('div');
    cornerTopLeft.className = 'corner-top-left';
    div.appendChild(cornerTopLeft);
    const cornerTopRight = document.createElement('div');
    cornerTopRight.className = 'corner-top-right';
    div.appendChild(cornerTopRight);
    const cornerBottomLeft = document.createElement('div');
    cornerBottomLeft.className = 'corner-bottom-left';
    div.appendChild(cornerBottomLeft);
    const cornerBottomRight = document.createElement('div');
    cornerBottomRight.className = 'corner-bottom-right';
    div.appendChild(cornerBottomRight);

    if (cell == startCell) {
        const startCircle = document.createElement('div');
        startCircle.classList.add('start');
        div.appendChild(startCircle);
    } else if (cell == endCell) {
        const endCircle = document.createElement('div');
        endCircle.classList.add('end');
        div.appendChild(endCircle);
    }
}

function handleStart(cellDiv: HTMLElement, cell: Cell, maze: Maze) {
    if (cellDiv === startCellDiv || cellDiv === endCellDiv) return;
    if (!startCell) {
        cellDiv.classList.add('start');
        startCellDiv = cellDiv;
        startCell = cell;
        maze.setStartCell(cell);
    } else {
        startCellDiv!.classList.remove('start');
        cellDiv.classList.add('start');
        startCellDiv = cellDiv;
        startCell = cell;
        maze.setStartCell(startCell);
    }
}

function handleEnd(cellDiv: HTMLElement, cell: Cell, maze: Maze) {
    if (cellDiv === startCellDiv || cellDiv === endCellDiv) return;
    if (!endCell) {
        cellDiv.classList.add('end');
        endCellDiv = cellDiv;
        endCell = cell;
        maze.setEndCell(cell);
    } else {
        endCellDiv!.classList.remove('end');
        cellDiv.classList.add('end');
        endCellDiv = cellDiv;
        endCell = cell;
        maze.setEndCell(endCell);
    }
}

document.getElementById('solve')!.addEventListener('click', async () => {
    if (!startCell || !endCell) {
        alert('Please add a start and end cell first.');
        return;
    };

    const mazeBFS = maze!.clone();
    const mazeDFS = maze!.clone();
    const mazeAStar = maze!.clone();

    container.innerHTML = '';
    container.appendChild(renderMaze(mazeBFS, 'bfs'));
    container.appendChild(renderMaze(mazeDFS, 'dfs'));
    container.appendChild(renderMaze(mazeAStar, 'astar'));

    const bfsMazeDiv = document.getElementById('maze-bfs')!;
    const dfsMazeDiv = document.getElementById('maze-dfs')!;
    const astarMazeDiv = document.getElementById('maze-astar')!;

    const bfsGenerator = bfs(mazeBFS);
    const dfsGenerator = dfs(mazeDFS);
    const astarGenerator = aStar(mazeAStar);

    // Function to animate traversal
    const animateTraversal = async (generator: Generator<Maze>, mazeDiv: HTMLElement) => {
        for (const updatedMaze of generator) {
            mazeDiv.innerHTML = '';
            updatedMaze.getGrid().forEach(row => {
                row.forEach(cell => {
                    const div = document.createElement('div');
                    div.className = 'cell';
                    renderCell(cell, div);
                    if (cell == updatedMaze.startCell) div.classList.add('start');
                    if (cell == updatedMaze.endCell) div.classList.add('end');
                    if (cell == updatedMaze.currentCell) div.classList.add('current');
                    if (cell.visited) div.classList.add('visited');
                    if (cell.path) div.classList.add('path');
                    mazeDiv.appendChild(div);
                });
            });

            await new Promise(resolve => setTimeout(resolve, 50));
        }

    };

    await Promise.all([
        animateTraversal(bfsGenerator, bfsMazeDiv),
        animateTraversal(dfsGenerator, dfsMazeDiv),
        animateTraversal(astarGenerator, astarMazeDiv)
    ]);
});

document.getElementById('generate')!.addEventListener('click', () => {
    container.innerHTML = '';

    const rows = parseInt((document.getElementById('rows') as HTMLInputElement).value, 10);
    const cols = parseInt((document.getElementById('cols') as HTMLInputElement).value, 10);

    if (isNaN(rows) || isNaN(cols) || rows < 5 || cols < 5) {
        alert("Please enter valid dimensions (min: 5x5)");
        return;
    }

    maze = new Maze(Math.min(rows, 31), Math.min(cols, 31));
    const algorithm = (document.getElementById('algorithm') as HTMLSelectElement).value;
    
    if (algorithm === 'recursive') {
        maze.generateRecursiveBacktracking();
    } else if (algorithm === 'kruskal') {
        maze.generateKruskalsMaze();
    }

    maze.reset();
    const div = document.createElement('div');
    div.appendChild(document.createElement('h2')).textContent = ""
    const mazeDiv = renderMaze(maze, 'Generation');
    div.appendChild(mazeDiv);
    container.appendChild(div);
});