import React, { useState } from "react";
import wordList from "word-list-json";
import Tile from "./Tile";

const isInVisited = (visited, position) => {
  return visited.some(item => JSON.stringify(item) === JSON.stringify(position));
};

function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomNLetterWord = (n) => {
  const filteredWords = wordList.filter(word => word.length === n);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const generateRandomBoard = (rows, cols) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Characters to choose from
  const vowels = "AEIOUYAEIOUYAEO";
  const consonants = "BCDFGHJKLMNPQRSTVWXZ";
  const randomWord = getRandomNLetterWord(10);
  console.log("random word is: ", randomWord);
  let v = vowels
  let c = consonants;
  let board = []

  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      let randomChar = '';
      if (j % 2 == 0){
        randomChar = characters[Math.floor(Math.random() * v.length)];
        v = v.replace(randomChar, '');
      }
      else{
        randomChar = characters[Math.floor(Math.random() * c.length)];
        c = c.replace(randomChar, '');
      }
      row.push(randomChar);
    }
    board.push(row);
  }

  let startPos = [getRandomIntInRange(0, rows-1), getRandomIntInRange(0, cols-1)];
  let d = [[0, 1], [1, 0], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]];
  let visited = [];
  for(let l = 0; l < 10; ++l){
    d = shuffleArray(d);
    let choose = d[0];
    let newPos = [startPos[0] + choose[0], startPos[1] + choose[1]];
    let attempts = 0;
    while ((newPos[0] < 0 || newPos[0] > rows-1 || newPos[1] < 0 || newPos[1] > cols-1) || (isInVisited(visited, newPos))){
      choose = d[attempts];
      newPos = [startPos[0] + choose[0], startPos[1] + choose[1]];
      attempts ++;
      if(attempts >= 100){
        console.log("kys");
        break;
      }
    }
    console.log(newPos, randomWord[l].toUpperCase());
    visited.push(newPos);
    board[newPos[0]][newPos[1]] = randomWord[l].toUpperCase();
    startPos = newPos;
  }
  return board;
};

const Board = ({ rows = 4, cols = 4 }) => {

  const [board, setBoard] = useState(() => generateRandomBoard(rows, cols));
  const [selectedPath, setSelectedPath] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentWord, setCurrentWord] = useState("");

  const regenerateBoard = () => {
    setBoard(generateRandomBoard(rows, cols));
    setSelectedPath([]);
  };

  const onMouseDown = (rowIndex, colIndex) => {
    console.log("i am gay as fuck");
    setIsDragging(true);
    setSelectedPath([[rowIndex, colIndex]]);
  };

  const onMouseMove = (rowIndex, colIndex) => {
    if (isDragging) {
      setSelectedPath((prevPath) => {
        const lastPos = prevPath[prevPath.length - 1];
        const newPos = [rowIndex, colIndex];
        if (Math.abs(lastPos[0] - rowIndex) <= 1 && Math.abs(lastPos[1] - colIndex) <= 1 && !prevPath.some(pos => JSON.stringify(pos) === JSON.stringify(newPos))) {
          let selectedWord = "";
          for (let i = 0; i < selectedPath.length; ++i) {
            selectedWord += board[selectedPath[i][0]][selectedPath[i][1]];
          }
          selectedWord += board[newPos[0]][newPos[1]];
          setCurrentWord(selectedWord);
          return [...prevPath, newPos];
        }
        return prevPath;
      });
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    let selectedWord = "";
    for(let i = 0; i < selectedPath.length; ++i){
      selectedWord += board[selectedPath[i][0]][selectedPath[i][1]];
    }
    console.log(selectedWord);
    setSelectedPath([]);
  };

  const renderPath = () => {
    if (selectedPath.length > 1) {
      // console.log(pos);
      return selectedPath.map((pos, index) => (
        <line
          key={index}
          x1={pos[1] * 130 + 80} // Adjust for the position in the grid
          y1={pos[0] * 130 + 80}
          x2={(selectedPath[index + 1] ? selectedPath[index + 1][1] : pos[1]) * 130 + 80}
          y2={(selectedPath[index + 1] ? selectedPath[index + 1][0] : pos[0]) * 130 + 80}
          stroke="red"
          strokeWidth="30"
          opacity={0.5}
        />
      ));
    }
    return null;
  };

  return (
    <div>
      <h1>{currentWord}</h1>
      <button onClick={regenerateBoard} style={{ marginBottom: "10px", padding: "10px" }}>
        Generate New Board
      </button>
      <div style={{ position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: '500px',
            height: '500px',
            zIndex: 1,
            pointerEvents: "none" // Prevent SVG from capturing mouse events
          }}
        >
          {renderPath()}
        </svg>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, auto)`, gap: "10px" }}>
          {board.map((row, rowIndex) =>
            row.map((char, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => onMouseDown(rowIndex, colIndex)}
                onMouseMove={() => onMouseMove(rowIndex, colIndex)}
                onMouseUp={onMouseUp}
              >
                {char}
              </Tile>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
