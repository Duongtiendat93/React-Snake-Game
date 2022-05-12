import React, { useEffect, useRef, useState } from "react";
import {randomIntFromInterval,useInterval} from "../lib/ultils"
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
  const [foodCell,setFoodCell] = useState(48)
  const [snakeCells,setSnakeCells] = useState(new Set([44]));
  const [snake,setSnake] = useState(new SinglyLinkedList(new Cell(4,3,44)));
  const [direction,setDirection] = useState(Direction.RIGHT)
  const snakeCellsRef = useRef();
  // snakeCellsRef.current = new Set([44]);


  
  useEffect(()=>{
    window.addEventListener("keydown",e => {
      const newDirection = getDirectionFromKey(e.key);
      // kiểm  tra có phải hướng hợp lệ ko, có phải chuổi trống ko
      const isValidDirection = newDirection !== "" ;
      // set hướng đi
      if(isValidDirection) setDirection(newDirection)
    })

  },[]) 

  useInterval(()=>{
      moveSmake();  
    },1000)

  const moveSmake = () => {
    const currentHeadCoords = {
      row: snake.head.value.row,
      col: snake.head.value.col,
    };

    const nextHeadCoords = getNextHeadCoords(currentHeadCoords,direction);
    const nextHeadValue = broad[nextHeadCoords.row] [nextHeadCoords.col];

    if( nextHeadValue === foodCell) handleFoodConsumption()

    const newHead = new LinkedListNode(
      new Cell(nextHeadCoords.row,nextHeadCoords.col,nextHeadValue),
    );
    
    const newSnakeCells = new Set(snakeCellsRef.current);
    console.log("snakeCellsRef",snakeCellsRef.current)
    newSnakeCells.delete(snake.tail.value.value);
    newSnakeCells.add(nextHeadValue)
    
    console.log("snake:",newSnakeCells)
    snake.head = newHead;
    snake.tail = snake.tail.next;
    if(snake.tail === null) snake.tail = snake.head;

    // console.log("newSnakecells",newSnakeCells);
    // snakeCellsRef.current = newSnakeCells;
    // snakeCellsRef.current = newSnakeCells
    setSnakeCells(newSnakeCells);
  }
  //  Tiêu thụ thực phẩm
  const handleFoodConsumption = ( ) => {
    const maxPossibleCellValue = BROAD_SIZE * BROAD_SIZE;
    let nextFoodCell;
    while(true){
      nextFoodCell = randomIntFromInterval(1,maxPossibleCellValue);
      console.log("aaa",snakeCells)
      if(snakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue;
      break;
    }
    setFoodCell(nextFoodCell)
  }

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
    if(direction === Direction.LEFT){
      return{
        row: currentSnakeHead.row ,
        col:currentSnakeHead.col - 1,
      }
    }
  }
  

  return (
    <>
    <button onClick={() => moveSmake()} className="p-6 w-40 mx-auto rounded text-black mb-2 bg-slate-300 border-2 border-black  "> Move Manually</button>
      <div className="">
      {broad.map((row, rowindex) => (
        <div key={rowindex} className="h-10">
          {row.map((cellValue, cellindex) => (
            <div
              key={cellindex}
              className={`h-10 w-10 inline-block border-2 outline-orange-600 ${
                snakeCells.has(cellValue) ? "bg-red-500" :""
              } ${foodCell === cellValue ? "bg-black": ""}`}
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
  if (direction === "ArrowUp") return Direction.UP;
  if (direction ==="ArrowRight") return Direction.RIGHT;
  if (direction === "ArrowDown") return Direction.DOWN;
  if (direction === "ArrowLeft") return Direction.LEFT;
  return "";
}
export default Board;
