import { Maze, Cell } from "./maze/Maze";
import { dfs } from "./algorithms/dfs";
import { bfs } from "./algorithms/bfs";

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
    if (!startCell || !endCell) return;

    // Create copies of the maze for BFS and DFS
    const mazeBFS = maze!.clone();
    const mazeDFS = maze!.clone();

    // Clear the container and render initial mazes
    container.innerHTML = '';
    container.appendChild(renderMaze(mazeBFS, 'bfs'));
    container.appendChild(renderMaze(mazeDFS, 'dfs'));

    // Get the maze containers for BFS and DFS
    const bfsMazeDiv = document.getElementById('maze-bfs')!;
    const dfsMazeDiv = document.getElementById('maze-dfs')!;

    // Create generators for BFS and DFS
    const bfsGenerator = bfs(mazeBFS);
    const dfsGenerator = dfs(mazeDFS);

    // Function to animate traversal
    const animateTraversal = async (generator: Generator<Maze>, mazeDiv: HTMLElement) => {
        for (const updatedMaze of generator) {
            // Update the maze display
            mazeDiv.innerHTML = '';
            updatedMaze.getGrid().forEach(row => {
                row.forEach(cell => {
                    const div = document.createElement('div');
                    div.className = 'cell';
                    renderCell(cell, div);
                    if (cell == updatedMaze.startCell) div.classList.add('start');
                    if (cell == updatedMaze.endCell) div.classList.add('end');
                    if (cell.visited) div.classList.add('visited');
                    if (cell.path) div.classList.add('path');
                    mazeDiv.appendChild(div);
                });
            });

            // Add a small delay for animation
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
    };

    // Animate BFS and DFS simultaneously
    await Promise.all([
        animateTraversal(bfsGenerator, bfsMazeDiv),
        animateTraversal(dfsGenerator, dfsMazeDiv),
    ]);
});

document.getElementById('generate')!.addEventListener('click', () => {
    container.innerHTML = '';
    maze = new Maze(21, 21);
    maze.generateRecursiveBacktracking();
    maze.reset();
    const div = document.createElement('div');
    div.appendChild(document.createElement('h2')).textContent = `Maze`;
    const mazeDiv = renderMaze(maze, 'Generation');
    div.appendChild(mazeDiv);
    container.appendChild(div);
});