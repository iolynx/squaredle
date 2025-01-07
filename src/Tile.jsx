import './App.css';
import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const Tile = ({ onMouseDown, onMouseMove, onMouseUp, children, defaultStyle }) => {
  const [changeStyle, toggleStyle] = useState(!defaultStyle);

  useEffect(() => {
    if (defaultStyle) {
      toggleStyle(false);
    }
  }, [defaultStyle]);

  function handleMouseEnter(e) {
    // console.log("mouse just entered");
    if (e.buttons === 1) toggleStyle(true);
    else toggleStyle(false);
  }

  function handleMouseLeave(e) {
    if (e.buttons === 1) toggleStyle(true);
    else toggleStyle(false);
  }

  function handleMouseDown() {
    // console.log(children);
    toggleStyle(true);
    // console.log("FRom child down", defaultStyle);
    if (onMouseDown) onMouseDown();
  }

  function handleMouseUp() {
    // console.log("FRom child up: ", defaultStyle);
    toggleStyle(false);
    if (onMouseUp) onMouseUp();
  }


  const handleTileStyle = (defaultStyle, changeStyle) => {
    if (!defaultStyle) {
      if (changeStyle) {
        return {
          // backgroundColor: "red",
          // boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
          boxShadow: "5px 5px 10px rgba(200, 30, 30, 0.8)",
          scale: "1.03",
          color: "rgb(20, 0, 0)",
          // outline: "5px solid black",
          backgroundColor: "rgb(180, 180, 180)",
          cursor: "pointer",
          userSelect: "none", // Prevent text selection
          position: "relative",
        }
      }
    }
    // toggleStyle(false);
    return {
      // backgroundColor: "black",
      // boxShadow: "2px 2px black",
      cursor: "pointer",
      userSelect: "none", // Prevent text selection
      position: "relative",
    }
  };

  return (
    <div className="tile"
      style={handleTileStyle(defaultStyle, changeStyle)}
    >
      <div
        style={{
          // padding: "10px 10px",
          height: "75px",
          width: "75px"

        }}
        onMouseDown={handleMouseDown}

        onMouseMove={onMouseMove}

        onMouseUp={handleMouseUp}

        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <h1 style={{ margin: "0px" }}>
          {children}
        </h1>
      </div>
    </div>
  );
};

export default Tile;
