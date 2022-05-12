import React, { useEffect, useRef, useState } from "react";
import { randomIntFromInterval, useInterval } from "../lib/ultils";

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class SinglyLinkedList {
  constructor(value) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}
// class Cell {
//   constructor(row,col,value){
//     this.row = row;
//     this.col = col;
//     this.value = value;
//   }
// }
const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT",
};
const BROAD_SIZE = 10;
const STARTING_SNAKE_CELL = 44;
const STARTING_FOOD_CELL = 48;
const START_SNAKE_LL_VALUE = {
  row: BROAD_SIZE/2,
  col: BROAD_SIZE/2,
  cell: STARTING_SNAKE_CELL,
};

const getStartingSnakeLLValue = board => {
  const rowSize = board.length;
  const colSize = board[0].length;
  console.log("rowSize",colSize)
  const startingRow = Math.round(rowSize / 3);
  const startingCol = Math.round(colSize / 3);
  const startingCell = board[startingRow][startingCol];
  return {
    row: startingRow,
    col: startingCol,
    cell: startingCell,
  };
};

function Board() {
  const [score, setScore] = useState(0);
  const [broad, setBroad] = useState(createBroad(BROAD_SIZE));
  const [foodCell, setFoodCell] = useState(STARTING_FOOD_CELL);
  const [snakeCells, setSnakeCells] = useState(new Set([STARTING_SNAKE_CELL]));
  const [snake, setSnake] = useState(
    new SinglyLinkedList(getStartingSnakeLLValue(broad))
  );
  const [direction, setDirection] = useState(Direction.RIGHT);
  const snakeCellsRef = useRef();
  // snakeCellsRef.current = new Set([44]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      const newDirection = getDirectionFromKey(e.key);
      // kiểm  tra có phải hướng hợp lệ ko, có phải chuổi trống ko
      const isValidDirection = newDirection !== "";
      // set hướng đi
      if (isValidDirection) setDirection(newDirection);
    });
  }, []);

  useInterval(() => {
    moveSmake();
  }, 1000);

  const moveSmake = () => {
    const currentHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col,
    };

    const nextHeadCoords = getNextHeadCoords(currentHeadCoords, direction);

    if (isOutOfBounds(nextHeadCoords)) {
      handleGameOver();
      return;
    }

    const nextHeadValue = broad[nextHeadCoords.row][nextHeadCoords.col];

    if(snakeCells.has(nextHeadValue)){
      handleGameOver();
      return;
    }

    if (nextHeadValue === foodCell) {
      handleFoodConsumption();
      handleSnakeGrowth();
      
    }

    const newHead = new LinkedListNode({
      row: nextHeadCoords.row,
      col: nextHeadCoords.col,
      cell: nextHeadValue,
    });

    const newSnakeCells = new Set(snakeCellsRef.current);
    console.log("snakeCellsRef", snakeCellsRef.current);
    newSnakeCells.delete(snake.tail.value.value);
    newSnakeCells.add(nextHeadValue);

    console.log("snake:", newSnakeCells);
    snake.head = newHead;
    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;

    setSnakeCells(newSnakeCells);
  };

  const growSnake = () => {
    // const currentTailCoords = {
    //   row: snake.tail.value.row,
    //   col: snake.tail.value.col
    // }
    const getNextTailNodeDirection = getNextNodeDirection(snake.tail);
    // const growthNodeCoords = getGrowthDirection(snake.tail.tailNextNodeDirection,broad)
  }

  const handleSnakeGrowth = () => {
    // const maxPossibleCellValue = BROAD_SIZE * BROAD_SIZE;
    // let nextFoodCell;
    // while(true){
    //   nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
    //   if (snakeCells.has(nextFoodCell) || foodCell === nextFoodCell)
    //     continue;
    //   break;
    // }
  }
  //  Tiêu thụ thực phẩm
  const handleFoodConsumption = () => {
    const maxPossibleCellValue = BROAD_SIZE * BROAD_SIZE;
    let nextFoodCell;
    while (true) {
      nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
      console.log("aaa", snakeCells);
      if (snakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue;
      break;
    }
    setFoodCell(nextFoodCell);
    setScore(score + 1);
  };

  const getNextHeadCoords = (currentSnakeHead, direction) => {
    if (direction === Direction.UP) {
      return {
        row: currentSnakeHead.row - 1,
        col: currentSnakeHead.col,
      };
    }
    if (direction === Direction.RIGHT) {
      return {
        row: currentSnakeHead.row,
        col: currentSnakeHead.col + 1,
      };
    }
    if (direction === Direction.DOWN) {
      return {
        row: currentSnakeHead.row + 1,
        col: currentSnakeHead.col,
      };
    }
    if (direction === Direction.LEFT) {
      return {
        row: currentSnakeHead.row,
        col: currentSnakeHead.col - 1,
      };
    }
  };

  const handleGameOver = () => {
    setScore(0);
    const snakeLLStartingValue = getStartingSnakeLLValue(broad);
    setSnake(new SinglyLinkedList(snakeLLStartingValue));
    setFoodCell(snakeLLStartingValue.cell + 5);
    setSnakeCells(new Set([snakeLLStartingValue.cell]));
    setDirection(Direction.RIGHT);
  };

  return (
    <>
      <h1 className="text-3xl mb-6">Score: {score}</h1>
      <button onClick={growSnake()}>Grow Snake Manual</button>
      <div className="">
        {broad.map((row, rowindex) => (
          <div key={rowindex} className="h-10">
            {row.map((cellValue, cellindex) => (
              <div
                key={cellindex}
                className={`h-10 w-10 inline-block border-2 outline-orange-600 ${
                  snakeCells.has(cellValue) ? "bg-red-500" : ""
                } ${foodCell === cellValue ? "bg-black" : ""}`}
              >
                {cellValue}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
const createBroad = (BROAD_SIZE) => {
  let counter = 1;
  const board = [];
  for (let row = 0; row < BROAD_SIZE; row++) {
    const currentRow = [];
    for (let col = 0; col < BROAD_SIZE; col++) {
      // {console.log(">>>>>counter++",counter++)}
      currentRow.push(counter++);
    }
    board.push(currentRow);
  }
  return board;
};

const isOutOfBounds = (coords, board) => {
  const { row, col } = coords;
  if (row < 0 || col < 0) return true;
  // if (row >= board.length || col >= board[0].length) return true;
  return false;
};

const getDirectionFromKey = (direction) => {
  if (direction === "ArrowUp") return Direction.UP;
  if (direction === "ArrowRight") return Direction.RIGHT;
  if (direction === "ArrowDown") return Direction.DOWN;
  if (direction === "ArrowLeft") return Direction.LEFT;
  return "";
};

const getNextNodeDirection = (node,currentDirection) =>{
  if(node.next === null) return currentDirection;
  const {row :currentRow,col:currentCol} = node.value;
  const {row :nextRow,col:nextCol} = node.next.value;
  if(nextRow === currentRow && nextCol === currentCol + 1) {
    return Direction.RIGHT
  }
  if(nextRow === currentRow && nextCol === currentCol - 1) {
    return Direction.LEFT
  }
  if(nextRow === currentRow + 1 && nextCol === currentCol ) {
    return Direction.DOWN
  }
  if(nextRow === currentRow - 1 && nextCol === currentCol ) {
    return Direction.UP
  }
  return " ";
}
const getGrowthNodeCoords = (snakeTail, currentDirection) => {
  const tailNextNodeDirection = getNextNodeDirection(
    snakeTail,
    currentDirection,
  );
  const growthDirection = getOppositeDirection(tailNextNodeDirection);
  const currentTailCoords = {
    row: snakeTail.value.row,
    col: snakeTail.value.col,
  };
  const growthNodeCoords = getCoordsInDirection(
    currentTailCoords,
    growthDirection,
  );
  return growthNodeCoords;
};

const getOppositeDirection = direction => {
  if (direction === Direction.UP) return Direction.DOWN;
  if (direction === Direction.RIGHT) return Direction.LEFT;
  if (direction === Direction.DOWN) return Direction.UP;
  if (direction === Direction.LEFT) return Direction.RIGHT;
};

export default Board;
