const canvas = document.getElementById("gridCanvas");
const canvasSize = canvas.width;
const gridSize = 50; // 20x20 grid
let mousePosition = { x: undefined, y: undefined };

// Initialize the binary grid (all cells set to 0)
let binaryGrid = [];
for (let i = 0; i < gridSize; i++) {
  const row = [];
  for (let j = 0; j < gridSize; j++) {
    row.push(0); // Initially, all cells are 0
  }
  binaryGrid.push(row);
}

let mouseDown = false; // Track whether the mouse is pressed

if (canvas.getContext) {
  const ctx = canvas.getContext("2d");

  // Function to update the falling pixel logic
  function pixelFall() {
    for (let i = gridSize - 2; i >= 0; i--) {
      // Start from the second-last row
      for (let j = 0; j < gridSize; j++) {
        if (binaryGrid[i][j] == 1 && binaryGrid[i + 1][j] == 0) {
          // Move the pixel down
          binaryGrid[i][j] = 0;
          binaryGrid[i + 1][j] = 1;
        }
      }
    }
  }

  function flipBox() {}
  // Render the grid based on the binaryGrid array
  function renderGrid() {
    const pixelSize = canvasSize / gridSize;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Fill style based on whether the grid cell is 1 or 0
        ctx.fillStyle =
          binaryGrid[i][j] === 1
            ? "rgb(255,228,181) " // Blue for filled cells
            : "rgba(255, 255, 255, 1)"; // White for empty cells
        ctx.fillRect(j * pixelSize, i * pixelSize, pixelSize, pixelSize);
      }
    }
  }

  // Function to handle placing sand while the mouse is pressed
  function placeSand(mousePosition) {
    if (mouseDown) {
      // Only place sand when the mouse is held down
      const rect = canvas.getBoundingClientRect();
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;

      // Determine which grid cell was clicked
      const pixelSize = canvasSize / gridSize;
      const i = Math.floor(y / pixelSize); // Get the row index (y-axis)
      const j = Math.floor(x / pixelSize); // Get the column index (x-axis)

      // Set the clicked cell to 1 (create a "sand" particle)
      if (i < gridSize && j < gridSize && binaryGrid[i][j] === 0) {
        binaryGrid[i][j] = 1;
      }

      // Re-render the grid to show the change
      renderGrid();
    }
  }

  // Mouse down event - start placing sand
  canvas.addEventListener("mousedown", function () {
    mouseDown = true;
  });

  // Mouse up event - stop placing sand
  document.addEventListener("mouseup", function () {
    mouseDown = false;
  });

  // Mouse move event - continuously apply sand while the mouse is down
  canvas.addEventListener("mousemove", function (event) {
    mousePosition.x = event.clientX;
    mousePosition.y = event.clientY;
  });

  // Function to run the simulation
  function simulate() {
    placeSand(mousePosition);
    // Update the falling pixels
    pixelFall();

    // Render the updated grid
    renderGrid();

    // Keep the animation running
    requestAnimationFrame(simulate);
  }

  // Start the simulation
  simulate();
}
