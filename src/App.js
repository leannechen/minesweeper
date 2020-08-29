import React from 'react';
import imgBomb from './img/bomb-solid.svg';
import './App.css';

function App() {
  const mockData = [
    {
      x: 1,
      y: 1,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 2,
      y: 1,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 3,
      y: 1,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 1,
      y: 2,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 2,
      y: 2,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 3,
      y: 2,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 1,
      y: 3,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 2,
      y: 3,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
    {
      x: 3,
      y: 3,
      hasMine: false,
      showNumber: 1,
      isOpened: true,
    },
  ]
  return (
    <div className="App">
      <main className="main">
        <h1 className="site-title">Minesweeper</h1>
        <ul className="board">
          { mockData.map((item) =>
            <li 
              key={`${item.x}${item.y}`} 
              className={`square ${item.x === 2 && item.y === 2 && "opened bomb"} number-2`}
            >
              {/*{ item.x === 2 && item.y === 2 && "2" }*/}
              {/*X{item.x}Y{item.y}*/}
            </li>)
          }
        </ul>
      </main>
    </div>
  );
}

export default App;
