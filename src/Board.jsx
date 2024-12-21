import { useState } from "react";
import Tile from "./Tile";
import { generateRandomBoard } from "./helper.jsx"


// eslint-disable-next-line react/prop-types
const Board = ({ initialRows = 3, initialCols = 3 }) => {

  // const [board, setBoard] = useState(() => generateRandomBoard(rows, cols));
  const [board, setBoard] = useState([]);
  const [selectedPath, setSelectedPath] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentWord, setCurrentWord] = useState("->");
  const [defaultStyle, setDefaultStyle] = useState(true);
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);


  const regenerateBoard = (rows, cols) => {
    setRows(rows);
    setCols(cols);
    setBoard(generateRandomBoard(rows, cols));
    setSelectedPath([]);
  };

  const onMouseDown = (rowIndex, colIndex) => {
    setIsDragging(true);
    setSelectedPath([[rowIndex, colIndex]]);
    setDefaultStyle(false);
  };

  const onMouseMove = (rowIndex, colIndex) => {
    if (isDragging) {
      setSelectedPath((prevPath) => {
        const lastPos = prevPath[prevPath.length - 1];
        console.log("LastPos: ", lastPos);
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
    setDefaultStyle(true);
    setIsDragging(false);
    let selectedWord = "";
    for (let i = 0; i < selectedPath.length; ++i) {
      selectedWord += board[selectedPath[i][0]][selectedPath[i][1]];
    }
    console.log("Final Word: ", selectedWord);
    setSelectedPath([]);
  };

  function handleMouseLeave() {
    setDefaultStyle(true);
    setIsDragging(false);
    setSelectedPath([]);
  }

  function handleMouseUp() {
    setDefaultStyle(true);
    setIsDragging(false);
    setSelectedPath([]);
  }


  const renderPath = () => {
    if (selectedPath.length > 1) {
      // console.log(pos);
      const mul = 130;
      const xadd = 58;
      const yadd = 63;
      return selectedPath.map((pos, index) => (
        <>
          <line
            key={index}
            x1={pos[1] * mul + xadd}
            y1={pos[0] * mul + yadd}
            x2={(selectedPath[index + 1] ? selectedPath[index + 1][1] : pos[1]) * mul + xadd}
            y2={(selectedPath[index + 1] ? selectedPath[index + 1][0] : pos[0]) * mul + yadd}
            stroke="red"
            strokeWidth="30"
            opacity={0.45}
          />
          <circle
            r="15px"
            cx={(selectedPath[index + 1] ? selectedPath[index + 1][1] : pos[1]) * mul + xadd}
            cy={(selectedPath[index + 1] ? selectedPath[index + 1][0] : pos[0]) * mul + yadd}
            fill="red"
            opacity={0.45}
          />
        </>
      ));
    }
    return null;
  };

  return (
    <div>
      <h1>{currentWord}</h1>

      <h2>Generate New Board: </h2>
      <button onClick={() => regenerateBoard(3, 3)} style={{ marginBottom: "10px", padding: "10px" }}>
        3x3
      </button>
      <button onClick={() => regenerateBoard(4, 4)} style={{ marginBottom: "10px", padding: "10px" }}>
        4x4
      </button>
      <button onClick={() => regenerateBoard(5, 5)} style={{ marginBottom: "10px", padding: "10px" }}>
        5x5
      </button>
      <div style={{ position: "relative" }}>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: '600px',
            height: '600px',
            zIndex: 1,
            pointerEvents: "none",
            radius: "5px"
          }}
        >
          <filter id="constantOpacity">
            <feComponentTransfer>
              <feFuncA type="table" tableValues="0 .5 .5" />
            </feComponentTransfer>
          </filter>
          <g filter="url(#constantOpacity)">
            {renderPath()}
          </g>

        </svg>

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 114px)`,
          rowGap: "15px",
          columnGap: "15px"
        }}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
        >
          {board.map((row, rowIndex) =>
            row.map((char, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => onMouseDown(rowIndex, colIndex)}
                onMouseMove={() => onMouseMove(rowIndex, colIndex)}
                onMouseUp={onMouseUp}
                defaultStyle={defaultStyle}
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
