
const GRID_SIZE = 4;

export const slideAndMerge = (grid, direction) => {
  const movedGrid = grid.map(row => row.slice());
  const merged = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(false)
  );
  let score = 0;
  const animations = [];

  const addTile = (row, col, value) => {
    movedGrid[row][col] = value;
  };

  const moveTile = (fromRow, fromCol, toRow, toCol) => {
    if (movedGrid[fromRow][fromCol] !== 0) {
      addTile(toRow, toCol, movedGrid[fromRow][fromCol]);
      addTile(fromRow, fromCol, 0);
      animations.push({ fromRow, fromCol, toRow, toCol });
    }
  };

  const mergeTile = (fromRow, fromCol, toRow, toCol) => {
    if (
      movedGrid[fromRow][fromCol] === movedGrid[toRow][toCol] &&
      !merged[toRow][toCol] &&
      !merged[fromRow][fromCol]
    ) {
      addTile(toRow, toCol, movedGrid[toRow][toCol] * 2);
      addTile(fromRow, fromCol, 0);
      score += movedGrid[toRow][toCol];
      merged[toRow][toCol] = true;
      animations.push({ fromRow, fromCol, toRow, toCol, merge: true });
    }
  };

  const slideRowLeft = (row) => {
    let newRow = row.filter(tile => tile !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow.splice(i + 1, 1);
      }
    }
    return [...newRow, ...Array(GRID_SIZE - newRow.length).fill(0)];
  };

  const slideLeft = (grid) => {
    return grid.map(row => slideRowLeft(row));
  };

  const slideRight = (grid) => {
    return grid.map(row => slideRowLeft(row.reverse()).reverse());
  };

  const transpose = (grid) => {
    let newGrid = Array.from(Array(GRID_SIZE), () => Array(GRID_SIZE).fill(0));
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        newGrid[col][row] = grid[row][col];
      }
    }
    return newGrid;
  };

  const slideUp = (grid) => {
    let newGrid = transpose(grid);
    newGrid = slideLeft(newGrid);
    return transpose(newGrid);
  };

  const slideDown = (grid) => {
    let newGrid = transpose(grid);
    newGrid = slideRight(newGrid);
    return transpose(newGrid);
  };

  let newGrid;
  switch (direction) {
    case 'up':
      newGrid = slideUp(movedGrid);
      break;
    case 'down':
      newGrid = slideDown(movedGrid);
      break;
    case 'left':
      newGrid = slideLeft(movedGrid);
      break;
    case 'right':
      newGrid = slideRight(movedGrid);
      break;
    default:
      return [grid, score, animations];
  }

  return [newGrid, score, animations];
};
