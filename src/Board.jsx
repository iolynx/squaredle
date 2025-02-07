import { useState, useEffect } from "react";
import Tile from "./Tile";
import { generateRandomBoard, updateStartFrequencies, wordIsValid, generateCodeBoard, updateLetterFrequencies, getCellFrequencies, getStartingLetterFrequencies } from "./helper.jsx"


// eslint-disable-next-line react/prop-types
const Board = ({ initialRows = 3, initialCols = 3 }) => {

  // const [board, setBoard] = useState(() => generateRandomBoard(rows, cols));
  const [board, setBoard] = useState([]);
  const [isAnimating, setIsAnimating] = useState("none")
  const [selectedPath, setSelectedPath] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentWord, setCurrentWord] = useState("-");
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [defaultStyle, setDefaultStyle] = useState([]);
  const [points, setPoints] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [totalWords, setTotalWords] = useState(0);
  const [currentTile, setCurrentTile] = useState(null);
  const [cellFrequencies, setCellFrequencies] = useState([]);
  const [startFrequencies, setStartFrequencies] = useState([]);
  const [allWords, setAllWords] = useState([])


  // Helper function to generate the array
  const generateArray = (rows, cols, initialValue = true) => {
    return Array.from({ length: rows }, () => Array(cols).fill(initialValue));
  };

  // Regenerate the array when rows or cols changes
  // useEffect(() => {
  //   setDefaultStyleAll(true);
  // }, [rows, cols]);

  const setDefaultStyleAt = (rowIndex, colIndex, value) => {
    setDefaultStyle((prev) => {
      const newArray = prev.map((row, rIndex) =>
        row.map((cell, cIndex) =>
          rIndex === rowIndex && cIndex === colIndex ? value : cell
        )
      );
      return newArray;
    });
  };

  const setDefaultStyleAll = (value) => {
    const newArray = Array.from({ length: rows }, () => Array(cols).fill(value));
    setDefaultStyle(newArray);
  };

  const generateBoardFromCode = () => {
    const boardCode = document.getElementById("boardcode").value;
    console.log("Board Code: ", boardCode);
    const n = boardCode.length;
    console.log("n: ", n)
    let b, answerList;

    if (boardCode[0] == '#') {
      // if the boardcode is in the format #3asdlf , # means pseudorandom boards, 3 is the row/col width, and the remaining
      // part of the string forms the pseudorandom generator seed.

      console.log("Using pseudo random board generation...");
      setRows(parseInt(boardCode[1]));
      setCols(parseInt(boardCode[1]));
      [b, answerList] = generateRandomBoard(boardCode[1], boardCode[1], false, boardCode.slice(2));
    }
    else {
      if (Math.sqrt(n) % 1 !== 0) {
        alert("Error: Rows and Columns aren't the same length (Hint: Use a square number)");
        return;
      }
      setRows(Math.sqrt(n));
      setCols(Math.sqrt(n));
      [b, answerList] = generateCodeBoard(boardCode);
    }


    setPoints(0);
    setCurrentWord("-");
    setFoundWords([])
    setBoard(b);
    setAllWords(answerList);
    setTotalWords(answerList.length);
    setSelectedPath([]);
    setDefaultStyle(generateArray(rows, cols));
    setCellFrequencies(getCellFrequencies());
    setStartFrequencies(getStartingLetterFrequencies());
    console.log('CellFrequencies: ', cellFrequencies);
  }

  const showAllWords = () => {
    alert(allWords);
  }


  const regenerateBoard = (rows, cols) => {
    if (!confirm("Do you want to create a new Board? (This will delete all your progress)")) {
      return;
    }
    setRows(rows);
    setCols(cols);
    setPoints(0);
    setCurrentWord("-");
    setFoundWords([])
    setDefaultStyle(generateArray(rows, cols));
    const lwToggle = document.getElementById('lwtoggle');
    if (lwToggle.checked) {
      console.log("long words enabled");
    }
    const [b, anslist] = generateRandomBoard(rows, cols, lwToggle.checked);
    setBoard(b);
    setAllWords(anslist)
    setTotalWords(anslist.length);
    setSelectedPath([]);
    setCellFrequencies(getCellFrequencies());
    setStartFrequencies(getStartingLetterFrequencies());
    console.log(cellFrequencies);
    console.log(anslist);
  };

  const onMouseDown = (rowIndex, colIndex) => {
    setIsDragging(true);
    setSelectedPath([[rowIndex, colIndex]]);
    setDefaultStyleAt(rowIndex, colIndex, false);
  };

  useEffect(() => {
    const handleTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      const element = document.elementFromPoint(clientX, clientY);
      // debug logs:
      // console.log("touch recorded at ", touch);
      // console.log("touch element: ", element);
      // console.log("datapoint: ", element.dataset.key);
      if (element && element !== currentTile) {
        setCurrentTile(element || null)
        if (element.dataset.key) {
          const tileKey = element.dataset.key;
          setIsDragging(true)
          onMouseMove(parseInt(tileKey[0]), parseInt(tileKey[2]))
        }
      }
    }
    document.addEventListener("touchmove", handleTouchMove)
    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [currentTile]);

  const onMouseMove = (rowIndex, colIndex) => {
    if (isDragging) {
      if (selectedPath === undefined) { return; }
      setSelectedPath((prevPath) => {
        const lastPos = prevPath[prevPath.length - 1];
        const newPos = [rowIndex, colIndex];

        // Check if the cell is already part of the selected path
        const existingIndex = prevPath.findIndex(pos => JSON.stringify(pos) === JSON.stringify(newPos));

        if (existingIndex !== -1) {
          // If the cell is part of the path, cut the path till that cell
          const newPath = prevPath.slice(0, existingIndex + 1);
          const deletePath = prevPath.slice(existingIndex + 1, prevPath.length);
          // console.log(deletePath);

          let selectedWord = "";
          for (let i = 0; i < newPath.length; ++i) {
            selectedWord += board[newPath[i][0]][newPath[i][1]];
          }

          for (let i = 0; i < deletePath.length; ++i) {
            setDefaultStyleAt(deletePath[i][0], deletePath[i][1], true);
          }
          setCurrentWord(selectedWord);
          return newPath;
        }

        // Check if the new position is one cell away from the last position
        if (lastPos === undefined) {
          return;
        }
        if (Math.abs(lastPos[0] - rowIndex) <= 1 && Math.abs(lastPos[1] - colIndex) <= 1) {
          let selectedWord = "";
          for (let i = 0; i < prevPath.length; ++i) {
            selectedWord += board[prevPath[i][0]][prevPath[i][1]];
          }
          selectedWord += board[newPos[0]][newPos[1]];
          setCurrentWord(selectedWord);
          setDefaultStyleAt(rowIndex, colIndex, false);
          return [...prevPath, newPos];
        }

        return prevPath;
      });
    }
  };

  const onMouseUp = () => {
    // setDefaultStyle(true);
    setDefaultStyleAll(true);
    setIsDragging(false);
    let selectedWord = "";
    for (let i = 0; i < selectedPath.length; ++i) {
      selectedWord += board[selectedPath[i][0]][selectedPath[i][1]];
    }
    console.log("Final Word: ", selectedWord);

    console.log(wordIsValid(selectedWord))
    if (wordIsValid(selectedWord)) {
      if (foundWords.includes(selectedWord)) {
        const cw = currentWord;
        setCurrentWord("Already found.");
        setTimeout(() => setCurrentWord(cw), 1400);
        return
      }
      setPoints((prevPoints) => prevPoints + selectedWord.length * 2);
      console.log(selectedWord, " is correct.")
      setFoundWords([...foundWords, selectedWord])
      console.log('cf beforebefore: ', cellFrequencies)
      setCellFrequencies(updateLetterFrequencies(cellFrequencies, selectedPath))
      setStartFrequencies(updateStartFrequencies(startFrequencies, selectedPath))
      console.log(startFrequencies)
      console.log('letterFrequencies: ', cellFrequencies)
      setIsAnimating('correct')
    } else {
      setIsAnimating('incorrect')
    }
    setTimeout(() => setIsAnimating('none'), 1000)
    setSelectedPath([]);
  };

  function handleMouseLeave() {
    setDefaultStyleAll(true);
    setSelectedPath([]);
    if (isDragging) {
      setIsDragging(false);
      onMouseUp()
    }
  }

  function handleMouseUp() {
    setDefaultStyleAll(true);
    setIsDragging(false);
    setSelectedPath([]);
    onMouseUp();
  }


  const renderPath = () => {
    if (selectedPath === undefined) { return; }
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
    <div style={{ alignItems: "center", justifyContent: "center" }}>

      <div>
        <button className="text-button" onClick={() => showAllWords()} > {foundWords.length} / {totalWords} words </button>
      </div>


      <div className="score-wrapper">
        <h1 className={"score old-score " + (isAnimating === 'correct' ? "" : "invis")} >{points} points</h1>
        <h1 className={"score animated-score " + (isAnimating === 'correct' ? "correct-animation" : "invis")}>{points} points</h1>
        <h1 className={isAnimating === 'incorrect' ? "shaking-fade" : isAnimating === 'correct' ? "invis" : ""}> {currentWord} </h1>
      </div>


      <div style={{ position: "relative", margin: "10px 95px" }}>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
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
          columnGap: "15px",
        }}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          {board.map((row, rowIndex) =>
            row.map((char, colIndex) => (
              <Tile
                dataKey={[rowIndex, colIndex]}
                //data-key={`${rowIndex}-${colIndex}`}
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={() => onMouseDown(rowIndex, colIndex)}
                onMouseMove={() => onMouseMove(rowIndex, colIndex)}
                onMouseUp={onMouseUp}
                defaultStyle={defaultStyle[rowIndex][colIndex]}
                cellFrequency={cellFrequencies[rowIndex][colIndex]}
                startFrequency={startFrequencies[rowIndex][colIndex]}
              >
                {char}
              </Tile>
            ))
          )}
        </div>
      </div>
      <fieldset>
        <legend> <h2> &nbsp; Generate New Board: &nbsp; </h2> </legend>
        <div className="container">
          <div>
            <button onClick={() => regenerateBoard(3, 3)}>
              3x3
            </button>
            <button onClick={() => regenerateBoard(4, 4)}>
              4x4
            </button>
            <button onClick={() => regenerateBoard(5, 5)}>
              5x5
            </button>
            <h3> Long Word: </h3>
            <label className="switch">
              <input type="checkbox" id="lwtoggle" />
              <span className="slider round"></span>
            </label>
            <h4> Seed: (optional) </h4>
          </div>
          <hr />
          <div style={{ alignItems: "center", display: "inline" }}>
            <h3> Board Code: </h3>
            <textarea id="boardcode" />
            <br />
            <button onClick={() => generateBoardFromCode()}>
              Go!
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default Board;
