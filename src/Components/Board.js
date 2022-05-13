import React, { useEffect, useRef, useState } from "react";
import { randomIntFromInterval, useInterval,reverseLinkedList } from "../lib/ultils";

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
class LinkedList {
  constructor(value) {
    const node = new LinkedListNode(value);
    this.head = node;
    this.tail = node;
  }
}

const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT",
};
const PROBABILITY_OF_DIRECTION_REVERSAL_FOOD = 0.3;
const BROAD_SIZE = 10;
const STARTING_SNAKE_CELL = 44;
const STARTING_FOOD_CELL = 48;
const START_SNAKE_LL_VALUE = {
  row: BROAD_SIZE/3,
  col: BROAD_SIZE/3,
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
  const [snakeCells, setSnakeCells] = useState(new Set([START_SNAKE_LL_VALUE]));
  const [snake, setSnake] = useState(
    new LinkedList(getStartingSnakeLLValue(broad))
  );
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [foodShouldReverseDirection, setFoodShouldReverseDirection] = useState(
    false,
  )
  const snakeCellsRef = useRef();

  useEffect(() => {
    window.addEventListener('keydown', e => {
      handleKeydown(e);
    });
  }, []);

  useInterval(() => {
    moveSmake();
  }, 150);

  const handleKeydown = e => {
    const newDirection = getDirectionFromKey(e.key);
    const isValidDirection = newDirection !== '';
    if (!isValidDirection) return;
    const snakeWillRunIntoItself =
      getOppositeDirection(newDirection) === direction && snakeCells.size > 1;
    if (snakeWillRunIntoItself) return;
    setDirection(newDirection);
  };


  const moveSmake = () => {
    const currentHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col,
    };

    const nextHeadCoords = getCoordsInDirection(currentHeadCoords, direction);
    if (isOutOfBounds(nextHeadCoords,broad)) {
      handleGameOver();
      return;
    }

    const nextHeadValue = broad[nextHeadCoords.row][nextHeadCoords.col];
    if(snakeCells.has(nextHeadValue)){
      handleGameOver();
      return;
    }
    const newHead = new LinkedListNode({
      row: nextHeadCoords.row,
      col: nextHeadCoords.col,
      cell: nextHeadValue,
    });

    // if (nextHeadValue === foodCell) {
    //   handleFoodConsumption();
    //   handleSnakeGrowth();
    // }

    const currentHead = snake.head;
    snake.head = newHead;
    currentHead.next = newHead;

    const newSnakeCells = new Set(snakeCells);
    newSnakeCells.delete(snake.tail.value.cell);
    newSnakeCells.add(nextHeadValue);

    snake.tail = snake.tail.next;
    if (snake.tail === null) snake.tail = snake.head;

    const foodConsumed = nextHeadValue === foodCell;
    if (foodConsumed) {
      growSnake(newSnakeCells);
      if (foodShouldReverseDirection) reverseSnake();
      handleFoodConsumption(newSnakeCells);
      setSnakeCells(newSnakeCells)
    }

      // This function mutates newSnakeCells.

    
    setSnakeCells(newSnakeCells);
  };
  const growSnake = newSnakeCells => {
    const growthNodeCoords = getGrowthNodeCoords(snake.tail, direction);
    if (isOutOfBounds(growthNodeCoords, broad)) {
      // Snake is positioned such that it can't grow; don't do anything.
      return;
    }
    const newTailCell = broad[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkedListNode({
      row: growthNodeCoords.row,
      col: growthNodeCoords.col,
      cell: newTailCell,
    });
    const currentTail = snake.tail;
    snake.tail = newTail;
    snake.tail.next = currentTail;

    newSnakeCells.add(newTailCell);
  };
  const reverseSnake = () => {
    const tailNextNodeDirection = getNextNodeDirection(snake.tail, direction);
    const newDirection = getOppositeDirection(tailNextNodeDirection);
    setDirection(newDirection);

    // The tail of the snake is really the head of the linked list, which
    // is why we have to pass the snake's tail to `reverseLinkedList`.
    reverseLinkedList(snake.tail);
    const snakeHead = snake.head;
    snake.head = snake.tail;
    snake.tail = snakeHead;
  };



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
  const handleFoodConsumption = newSnakeCells => {
    const maxPossibleCellValue = BROAD_SIZE * BROAD_SIZE;
    let nextFoodCell;
    // In practice, this will never be a time-consuming operation. Even
    // in the extreme scenario where a snake is so big that it takes up 90%
    // of the board (nearly impossible), there would be a 10% chance of generating
    // a valid new food cell--so an average of 10 operations: trivial.
    while (true) {
      nextFoodCell = randomIntFromInterval(1, maxPossibleCellValue);
      if (newSnakeCells.has(nextFoodCell) || foodCell === nextFoodCell)
        continue;
      break;
    }

    const nextFoodShouldReverseDirection =
      Math.random() < PROBABILITY_OF_DIRECTION_REVERSAL_FOOD;

    setFoodCell(nextFoodCell);
    setFoodShouldReverseDirection(nextFoodShouldReverseDirection);
    setScore(score + 1);
  };

 

  const handleGameOver = () => {
    setScore(0);
    const snakeLLStartingValue = getStartingSnakeLLValue(broad);
    setSnake(new LinkedList(snakeLLStartingValue));
    setFoodCell(snakeLLStartingValue.cell + 5);
    setSnakeCells(new Set([snakeLLStartingValue.cell]));
    setDirection(Direction.RIGHT);
  };

  return (
    <>
      <h1 className="text-3xl mb-6">Score: {score}</h1>
      {/* <button onClick={growSnake()}>Grow Snake Manual</button> */}
      <div className="">
        {broad.map((row, rowindex) => (
          <div key={rowindex} className="h-10">
            {row.map((cellValue, cellindex) => (
              <div
                key={cellindex}
                className={`h-10 w-10 inline-block border-2 outline-orange-600 ${
                  snakeCells.has(cellValue) ? "bg-red-500" : ""
                } ${foodCell === cellValue ? "bg-black" : ""} ${foodShouldReverseDirection === cellValue ? "bg-blue-700" : ""}`}
              >
                {/* {cellValue} */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
const getCoordsInDirection = (coords, direction) => {
  if (direction === Direction.UP) {
    return {
      row: coords.row - 1,
      col: coords.col,
    };
  }
  if (direction === Direction.RIGHT) {
    return {
      row: coords.row,
      col: coords.col + 1,
    };
  }
  if (direction === Direction.DOWN) {
    return {
      row: coords.row + 1,
      col: coords.col,
    };
  }
  if (direction === Direction.LEFT) {
    return {
      row: coords.row,
      col: coords.col - 1,
    };
  }
};
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
  console.log("board",coords)
  const { row, col } = coords;
  if (row < 0 || col < 0) return true;
  if (row >= board.length || col >= board[0].length) return true;
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
