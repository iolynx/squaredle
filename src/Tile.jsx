import './App.css';

// eslint-disable-next-line react/prop-types
const Tile = ({ onMouseDown, onMouseMove, onMouseUp, children }) => {
  function onMouseDown2(){
    console.log(children);
    onMouseDown();
  }
  return (
    <div className="tile"
    style = {{
      cursor: "pointer",
      position: "relative"
    }}
    onMouseDown={onMouseDown2}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
    >
      <h1>
        {children}
      </h1>
    </div>
  );
};

export default Tile;
