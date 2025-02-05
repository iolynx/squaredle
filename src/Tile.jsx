import './App.css';
import { useState, useEffect, useRef } from 'react';

// eslint-disable-next-line react/prop-types
const Tile = ({ dataKey, onMouseDown, onMouseMove, onMouseUp, children, defaultStyle, cellFrequency, startFrequency }) => {
  const [changeStyle, toggleStyle] = useState(!defaultStyle);
  const elementRef = useRef(null)

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
    onMouseDown();
  }

  function handleMouseUp() {
    // console.log("FRom child up: ", defaultStyle);
    toggleStyle(false);
    onMouseUp();
  }

  const handleTouchStart = () => {
    const rect = elementRef.current.getBoundingClientRect()
    elementRef.current.dataset.rect = JSON.stringify(rect)
    toggleStyle(true)
    onMouseDown()
  }

  function handleTouchMove(e) {
    const rect = elementRef.current.getBoundingClientRect()
    console.log("default style: ", defaultStyle, "for :", children)

    const touch = e.touches[0];
    const { clientX, clientY } = touch;

    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      toggleStyle(false)
    }
    else {
      toggleStyle(true)
    }
  }


  const handleTileStyle = (defaultStyle, changeStyle) => {
    if (!defaultStyle) {
      if (changeStyle || !defaultStyle) {
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
    if (cellFrequency === 0) {
      return {
        color: "rgb(0, 0, 0)",
        backgroundColor: "rgb(35, 35, 40)"
      }
    } else {
      return {
        // backgroundColor: "black",
        // boxShadow: "2px 2px black",
        cursor: "pointer",
        userSelect: "none", // Prevent text selection
        position: "relative",
      }
    }
  };

  return (
    <div className="tile"
      data-key={dataKey}
      style={handleTileStyle(defaultStyle, changeStyle)}
    >
      <div
        ref={elementRef}
        style={{
          // padding: "10px 10px",
          height: "75px",
          width: "75px"

        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}

        onMouseMove={onMouseMove}
        onTouchMove={handleTouchMove}

        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}

        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <div style={{ display: 'block' }}>
          <h1 style={{ margin: "0px" }}>
            {children}
          </h1>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'red', margin: 0 }}>{startFrequency ? startFrequency : ''}</p>
            <span style={{ display: 'inline' }}>{cellFrequency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
