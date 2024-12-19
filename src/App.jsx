import './App.css'
import Board from './Board';

function App() {
  return (
    <>
      <div>
        <h1>Welcome to Squaredle</h1>
      </div>
      <h3>Today&apos;s Game:</h3>
      <div className="card">
      </div>
      <div className="game">
        <Board/>
      </div>
    </>
  );
};

export default App;
