import Maze from "./maze/Maze";

const container = document.getElementById("maze-container")!;
container.style.gridTemplateColumns = 'repeat(2, 1fr)';
container.style.gap = '20px';

function renderMazes() {
    const maze = new Maze(21, 21);
    maze.generateRecursiveBacktracking();
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

                // Top wall
                if (cell.walls.top) {
                    const topWall = document.createElement('div');
                    topWall.className = 'top-wall';
                    div.appendChild(topWall);
                }

                // Right wall
                if (cell.walls.right) {
                    const rightWall = document.createElement('div');
                    rightWall.className = 'right-wall';
                    div.appendChild(rightWall);
                }

                // Bottom wall
                if (cell.walls.bottom) {
                    const bottomWall = document.createElement('div');
                    bottomWall.className = 'bottom-wall';
                    div.appendChild(bottomWall);
                }

                // Left wall
                if (cell.walls.left) {
                    const leftWall = document.createElement('div');
                    leftWall.className = 'left-wall';
                    div.appendChild(leftWall);
                }
                
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

                mazeDiv.appendChild(div);
            })
        })

        container.appendChild(mazeDiv);
    }
}


document.getElementById('generate')!.addEventListener('click', () => {
    container.innerHTML = '';
    renderMazes();
});
