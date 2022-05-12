import React, { useEffect, useRef, useState } from "react";

const BROAD_SIZE = 10;

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
class Cell {
  constructor(row,col,value){
    this.row = row;
    this.col = col;
    this.value = value;
  }
}
const Direction = {
  UP : "UP",
  RIGHT : "RIGHT",
  DOWN : "DOWN",
  LEFT : "LEFT",
}
function Board() {
  const [broad, setBroad] = useState(createBroad(BROAD_SIZE));
  const [snakeCells,setSnakeCells] = useState(new Set([44]));
  const [snake,setSnake] = useState(new SinglyLinkedList(new Cell(4,3,44)));
  const [direction,setDirection] = useState(Direction.RIGHT)
  // const snakeCellsRef = useRef();
  // snakeCellsRef.current = new Set([44]);

 

  const getNextHeadCoords = (currentSnakeHead,direction) => {
    if(direction === Direction.UP){
      return{
        row: currentSnakeHead.row - 1,
        col:currentSnakeHead.col,
      }
    }
    if(direction === Direction.RIGHT){
      return{
        row: currentSnakeHead.row ,
        col:currentSnakeHead.col + 1,
      }
    }
    if(direction === Direction.DOWN){
      return{
        row: currentSnakeHead.row + 1,
        col:currentSnakeHead.col,
      }
    }
    if(direction === Direction.UP){
      return{
        row: currentSnakeHead.row ,
        col:currentSnakeHead.col - 1,
      }
    }
  }
  useEffect(()=>{
    setInterval(()=>{
      // moveSmake();  
    },1000)

    window.addEventListener("keydown",e => {
      const newDirection = getDirectionFromKey(e.key);
      const isValidDirection = newDirection !== "" ;
      if(isValidDirection) setDirection(newDirection)
    })

  },[])

  const moveSmake = () => {
    const currentHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col,
    };

    const nextHeadCoords = getNextHeadCoords(currentHeadCoords,direction);
    const nextHeadValue = broad[nextHeadCoords.row] [nextHeadCoords.col];
    const newHead = new LinkedListNode(
      new Cell(nextHeadCoords.row,nextHeadCoords.col,nextHeadValue),
    );

    const newSnakeCells = new Set(snakeCells);
    // console.log("snakeCellsRef",snakeCellsRef.current)
    newSnakeCells.delete(snake.tail.value.value);
    newSnakeCells.add(nextHeadValue)

    snake.head = newHead;
    snake.tail = snake.tail.next;
    if(snake.tail === null) snake.tail = snake.head;

    // console.log("newSnakecells",newSnakeCells);
    // snakeCellsRef.current = newSnakeCells;
    setSnakeCells(newSnakeCells)
  }

  

  return (
    <>
    <button onClick={() => moveSmake()}> Move Manually</button>
      <div className="">
      {broad.map((row, rowindex) => (
        <div key={rowindex} className="h-10">
          {row.map((cellValue, cellindex) => (
            <div
              key={cellindex}
              className={`h-10 w-10 inline-block border-2 outline-orange-600 ${
                snakeCells.has(cellValue) ? "bg-green-500" :""
              }`}
            >{cellValue}</div>
          ))}
        </div>
      ))}
    </div>
    </>
    
  );
}
const createBroad = BROAD_SIZE => {
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
const getDirectionFromKey = direction => {
  if (direction === Direction.UP) return Direction.DOWN;
  if (direction === Direction.RIGHT) return Direction.LEFT;
  if (direction === Direction.DOWN) return Direction.UP;
  if (direction === Direction.LEFT) return Direction.RIGHT;
  return "";
}
export default Board;
