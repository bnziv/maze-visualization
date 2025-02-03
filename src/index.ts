import { Maze, Cell } from "./maze/Maze";
import { dfs } from "./algorithms/dfs";

const container = document.getElementById("maze-container")!;
container.style.gridTemplateColumns = 'repeat(2, 1fr)';
container.style.gap = '20px';

let startCell: Cell | null = null;
let startCellDiv: HTMLElement | null = null;
let endCell: Cell | null = null;
let endCellDiv: HTMLElement | null = null;

let maze: Maze | null = null;

function renderMazes(maze: Maze) {
    const grid = maze.getGrid();

    for (let i = 0; i < 4; i++) {
        const mazeDiv = document.createElement('div');
        mazeDiv.id = `maze-${i}`;
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
                if (cell.visited) div.classList.add('visited');
                if (cell.path) div.classList.add('path');
                mazeDiv.appendChild(div);
            })
        })

        container.appendChild(mazeDiv);
    }
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
        const startCircle = document.createElement('div');
        startCircle.classList.add('start');
        cellDiv.appendChild(startCircle);

        startCellDiv = cellDiv;
        startCell = cell;
        maze.setStartCell(cell);
    } else {
        startCellDiv!.querySelector('.start')?.remove();
        const startCircle = document.createElement('div');
        startCircle.classList.add('start');
        cellDiv.appendChild(startCircle);

        startCellDiv = cellDiv;
        startCell = cell;
        maze.setStartCell(startCell);
    }
}

function handleEnd(cellDiv: HTMLElement, cell: Cell, maze: Maze) {
    if (cellDiv === startCellDiv || cellDiv === endCellDiv) return;
    if (!endCell) {
        const endCircle = document.createElement('div');
        endCircle.classList.add('end');
        cellDiv.appendChild(endCircle);

        endCellDiv = cellDiv;
        endCell = cell;
        maze.setEndCell(cell);
    } else {
        endCellDiv!.querySelector('.end')?.remove();
        const endCircle = document.createElement('div');
        endCircle.classList.add('end');
        cellDiv.appendChild(endCircle);

        endCellDiv = cellDiv;
        endCell = cell;
        maze.setEndCell(endCell);
    }
}

document.getElementById('solve')!.addEventListener('click', () => {
    if (!startCell || !endCell) return;
    dfs(maze!);
    container.innerHTML = '';
    renderMazes(maze!);
});

document.getElementById('generate')!.addEventListener('click', () => {
    container.innerHTML = '';
    maze = new Maze(21, 21);
    maze.generateRecursiveBacktracking();
    maze.reset();
    renderMazes(maze);
});
