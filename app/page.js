"use client";
import React, { useState, useEffect } from "react";
import useEventListener from "@use-it/event-listener";
import useSwipe from "./components/useSwipe";

const GRID_SIZE = 4;
const STARTING_TILES = 2;

const Game2048 = () => {
  const [grid, setGrid] = useState(generateGrid());
  const [score, setScore] = useState(0);
  const [mergeAnimations, setMergeAnimations] = useState(new Set());

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    let newGrid = generateGrid();
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
  };

  const handleSwipe = (direction) => {
    handleMove(direction);
  };

  useSwipe(handleSwipe);

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        handleMove("up");
        break;
      case "ArrowDown":
        handleMove("down");
        break;
      case "ArrowLeft":
        handleMove("left");
        break;
      case "ArrowRight":
        handleMove("right");
        break;
      default:
        break;
    }
  };

  useEventListener("keydown", handleKeyDown);

  const handleMove = (direction) => {
    let newGrid;
    let newMergeAnimations = new Set();
    switch (direction) {
      case "up":
        newGrid = slideUp(grid, newMergeAnimations);
        break;
      case "down":
        newGrid = slideDown(grid, newMergeAnimations);
        break;
      case "left":
        newGrid = slideLeft(grid, newMergeAnimations);
        break;
      case "right":
        newGrid = slideRight(grid, newMergeAnimations);
        break;
      default:
        return;
    }

    if (newGrid !== grid) {
      addRandomTile(newGrid);
      setGrid([...newGrid]);
      setMergeAnimations(newMergeAnimations);
      setTimeout(() => setMergeAnimations(new Set()), 200);
    }
  };

  const slideRowLeft = (row, mergeAnimations) => {
    let newRow = row.filter((tile) => tile !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        setScore((score) => score + newRow[i]);
        mergeAnimations.add(`${i}-${newRow[i]}`);
        newRow.splice(i + 1, 1);
      }
    }
    return [...newRow, ...Array(GRID_SIZE - newRow.length).fill(0)];
  };

  const slideLeft = (grid, mergeAnimations) => {
    return grid.map((row) => slideRowLeft(row, mergeAnimations));
  };

  const slideRight = (grid, mergeAnimations) => {
    return grid.map((row) =>
      slideRowLeft(row.reverse(), mergeAnimations).reverse()
    );
  };

  const slideUp = (grid, mergeAnimations) => {
    let newGrid = transpose(grid);
    newGrid = slideLeft(newGrid, mergeAnimations);
    return transpose(newGrid);
  };

  const slideDown = (grid, mergeAnimations) => {
    let newGrid = transpose(grid);
    newGrid = slideRight(newGrid, mergeAnimations);
    return transpose(newGrid);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="flex items-center justify-center flex-col mb-8">
        <div className="flex w-80 justify-between items-center">
          <div className="text-[40px] font-bold">2048</div>
          <div className="flex gap-5 items-center">
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={startNewGame}
            >
              Restart
            </button>
            <p className="text-xl font-bold mb-4">Score: {score}</p>
          </div>
        </div>
        <div className="w-80 h-80 grid grid-cols-4 gap-1 bg-gray-300 p-2 rounded-xl">
          {grid.flat().map((tile, index) => (
            <div
              key={index}
              className={`h-16 w-16 flex items-center justify-center rounded-sm text-[35px] font-bold ${
                tileColors[tile] || "bg-gray-400"
              } text-white`}
            >
              {tile !== 0 && tile}
            </div>
          ))}
        </div>
        <p className="text-lg font-medium w-80 mt-8">
          HOW TO PLAY: Use your arrow keys to move the tiles. When two tiles
          with the same number touch, they merge into one!
        </p>
      </div>
    </div>
  );
};

const generateGrid = () => {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
};

const addRandomTile = (grid) => {
  const emptyTiles = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyTiles.push({ row, col });
      }
    }
  }
  if (emptyTiles.length > 0) {
    const { row, col } =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
};

const tileColors = {
  2: "bg-gray-100 text-gray-700",
  4: "bg-yellow-200 text-gray-700",
  8: "bg-yellow-300 text-gray-700",
  16: "bg-orange-400 text-gray-700",
  32: "bg-orange-500 text-white",
  64: "bg-orange-600 text-white",
  128: "bg-red-400 text-white",
  256: "bg-red-500 text-white",
  512: "bg-red-600 text-white",
  1024: "bg-purple-500 text-white",
  2048: "bg-purple-600 text-white",
};

export default Game2048;
