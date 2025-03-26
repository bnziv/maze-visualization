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

function renderMaze(maze: Maze, id: string, header: boolean = true) {
    const wrapper = document.createElement('div');
    if (header) wrapper.appendChild(document.createElement('h2')).textContent = id;
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

    wrapper.appendChild(mazeDiv);
    return wrapper;
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
    (document.getElementsByClassName('instructions')[0] as HTMLElement).style.display = 'none';

    const selectedAlgorithms = [];
    if ((document.getElementById('bfs') as HTMLInputElement).checked) selectedAlgorithms.push('bfs');
    if ((document.getElementById('dfs') as HTMLInputElement).checked) selectedAlgorithms.push('dfs');
    if ((document.getElementById('astar') as HTMLInputElement).checked) selectedAlgorithms.push('astar');

    if (selectedAlgorithms.length === 0) {
        return;
    }

    const mazeInstances = {
        bfs: selectedAlgorithms.includes('bfs') ? maze!.clone() : null,
        dfs: selectedAlgorithms.includes('dfs') ? maze!.clone() : null,
        astar: selectedAlgorithms.includes('astar') ? maze!.clone() : null
    };

    container.innerHTML = '';
    if (document.getElementById('maze-Generation')) document.getElementById('maze-Generation')!.remove();
    
    if (mazeInstances.bfs) {
        container.appendChild(renderMaze(mazeInstances.bfs, 'BFS'));
    }
    if (mazeInstances.dfs) {
        container.appendChild(renderMaze(mazeInstances.dfs, 'DFS'));
    }
    if (mazeInstances.astar) {
        container.appendChild(renderMaze(mazeInstances.astar, 'A*'));
    }

    const generators = {
        bfs: bfs(mazeInstances.bfs!),
        dfs: dfs(mazeInstances.dfs!),
        astar: aStar(mazeInstances.astar!)
    };

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

    const animations = [];

    if (mazeInstances.bfs) {
        const bfsMazeDiv = document.getElementById('maze-BFS')!;
        animations.push(animateTraversal(generators.bfs, bfsMazeDiv));
    }
    if (mazeInstances.dfs) {
        const dfsMazeDiv = document.getElementById('maze-DFS')!;
        animations.push(animateTraversal(generators.dfs, dfsMazeDiv));
    }
    if (mazeInstances.astar) {
        const astarMazeDiv = document.getElementById('maze-A*')!;
        animations.push(animateTraversal(generators.astar, astarMazeDiv));
    }

    await Promise.all(animations);
});

document.getElementById('generate')!.addEventListener('click', () => {
    container.innerHTML = '';
    (document.getElementsByClassName('instructions')[0] as HTMLElement).style.display = 'block';

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

    if (document.getElementById('maze-Generation')) document.getElementById('maze-Generation')!.remove();
    const div = renderMaze(maze, 'Generation', false);
    div.style.width = 'fit-content';
    div.style.margin = '0 auto';
    div.id = 'maze-Generation';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.before(div);

    document.getElementById('solve-container')!.style.display = 'block';
});