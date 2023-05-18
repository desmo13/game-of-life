import kaboom from "kaboom";
kaboom({
  background: [0, 0, 0],
  width: 1024,
  height: 640,
  scale: 1,
  debug: true,
});

const GRID_SIZE = 100;

function createGrid() {
  let grid = new Array(GRID_SIZE)


  for (let y = 0; y < GRID_SIZE; y++) {
    grid[y] = new Array(GRID_SIZE).fill(false)
  }
  return grid
}

function getNumberNeighbors(matrix, x, y) {
  let count = 0;
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        // this is the cell itself, do nothing
        continue;
      }
      let currentX = x + i;
      let currentY = y + j;
      if (
        currentX < 0 ||
        currentX >= GRID_SIZE ||
        currentY < 0 ||
        currentY >= GRID_SIZE
      ) {
        // this is an edge cell, do nothing
        continue;
      } else if (matrix[currentX][currentY] === true) {
        // the neighbor is alive, count it
        count++;
      }
    }
  }
  return count;
}

function nextGeneration(grid) {
  const newxGrid = createGrid()

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const cellNeighbors = getNumberNeighbors(grid, x, y);
      if (grid[x][y] === true) {
        if (cellNeighbors === 2 || cellNeighbors === 3) {
          newxGrid[x][y] = true;
        } else {
          newxGrid[x][y] = false;
        }
      }

      if (grid[x][y] === false) {
        if (cellNeighbors === 3) {
          newxGrid[x][y] = true;
        } else {
          newxGrid[x][y] = false;

        }
      }
    }
  }
  console.log(newxGrid)
  return newxGrid;
}
scene("game", () => {
  let pause = true;
  let updateInterVal = 0.5;
  let generation = 0;
  let timeFromLastUpdate = 0;

  let grid = createGrid();


  onUpdate(() => {
    if (pause) {
      return;
    }
    timeFromLastUpdate += dt();
    if (timeFromLastUpdate < updateInterVal) {
      return;
    }
    timeFromLastUpdate = 0;
    generation++;
    grid = nextGeneration(grid)
  })
  const pauseText = add([
    text("Paused", { size: 16, font: "sink" }),
    pos(650, 40),
    origin("left"),
    layer("ui"),
  ]);

  const speedText = add([
    text("dt: 50ms", { size: 16, font: "sink" }),
    pos(650, 60),
    origin("left"),
    layer("ui"),
  ]);

  const generationText = add([
    text("Generation: 0", { size: 16, font: "sink" }),
    pos(650, 80),
    origin("left"),
    layer("ui"),
  ]);

  const CELL_SIZE = 10;
  function drawCell(row, col) {
    drawRect({
      width: CELL_SIZE,
      height: CELL_SIZE,
      pos: vec2(row * CELL_SIZE, col * CELL_SIZE),
      color: WHITE ,
      fill: true,
    })
  }
  function drawGridLines() {
    for (let i = 0; i <= GRID_SIZE; i++) {
      drawLine({
        p1: vec2(i * CELL_SIZE, 0),
        p2: vec2(i * CELL_SIZE, GRID_SIZE * CELL_SIZE),
        width: 1,
        color: YELLOW,
      })
      drawLine({

        p1: vec2(0, i * CELL_SIZE),
        p2: vec2(GRID_SIZE * CELL_SIZE, i * CELL_SIZE),
        width: 1,
        color: YELLOW,
      })
    }
  }
  onDraw(() => {
    speedText.text = `dt: ${(updateInterVal * 100).toFixed(0)}ms`;
    pauseText.text = pause ? "Paused" : "Running";
    generationText.text = `Generation: ${generation}`;

    for (let x=0; x < GRID_SIZE; x++) {
      for (let y=0; y < GRID_SIZE; y++) {
        if (grid[x][y] === true) {
          drawCell(x, y)
        }
      }
    }
    drawGridLines()
  })

  onMousePress("left", (pos) => {
    const row = Math.floor(pos.x / CELL_SIZE);
    const col = Math.floor(pos.y / CELL_SIZE);

    if (row < 0 || col < 0 || row >= GRID_SIZE || col >= GRID_SIZE) {
      return;

    }
    console.log(grid)
    grid[row][col] = true
  })
  onMousePress("right", (pos) => {
    const row = Math.floor(pos.x / CELL_SIZE);
    const col = Math.floor(pos.y / CELL_SIZE);

    if (row < 0 || col < 0 || row >= GRID_SIZE || col >= GRID_SIZE) {
      return;

    }
    grid[row][col] = false
  })
  onKeyPress("space", () => {
    pause = !pause;
  })
  onKeyDown("down", () => {
    updateInterVal += 0.01;
  })
  onKeyDown("up", () => {
    updateInterVal -= 0.01;
    updateInterVal = Math.max(0.0, updateInterVal)
  })
  onKeyPress("r", () => {
    grid = createGrid();
    updateInterVal = 0.5;
    generation = 0;
  })
})


go("game")