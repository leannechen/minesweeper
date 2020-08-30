import React from 'react';
import './App.css';

const mockData = [
  {
    x: 1,
    y: 1,
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 2,
    y: 1,
    hasMine: false,
    adjacentMines: 0,
    isOpened: true,
  },
  {
    x: 3,
    y: 1,
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 1,
    y: 2,
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 2,
    y: 2,
    hasMine: false,
    adjacentMines: 2,
    isOpened: true,
  },
  {
    x: 3,
    y: 2,
    hasMine: false,
    adjacentMines: 1,
    isOpened: true,
  },
  {
    x: 1,
    y: 3,
    hasMine: true,
    adjacentMines: 0,
    isOpened: true,
  },
  {
    x: 2,
    y: 3,
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 3,
    y: 3,
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
]


class App extends React.Component {

  state = {
    squareList: [],
  }

  componentDidMount() {
    // compute square
    this.setupSquareList();
  }

  handleSquareClick = (item) => () => {
    const { x, y } = item;
    const { squareList } = this.state;
    const targetSquareIndex = squareList.findIndex(square => square.x === x && square.y === y);
    const newSquareList = squareList.map((square, index) => (index === targetSquareIndex)?
      {
        ...square,
        isOpened: true,
      }
      :
      square
    )
    this.setState({ squareList: newSquareList });
  }

  setupSquareList = () => {
    const columns = 9;
    const rows = 8;
    const mineCount = 10;

    const squareList = new Array(rows)
      .fill()
      .map((item, yIndex) => {
        return new Array(columns)
          .fill()
          .map((item, xIndex) => ({
            x: xIndex + 1,
            y: yIndex + 1,
            id: `X${xIndex + 1}Y${yIndex + 1}`,
            hasMine: false,
            adjacentMines: 0,
            isOpened: false,
          }))
      })
      .flat()
    ;

    // Pick random squares and return their IDs
    const getRandomSquareIds = (arr, count) => {

      let copiedArr = [...arr];

      if(count > arr.length) {
        throw new RangeError("getRandom: More elements taken than available");
      }

      return new Array(count)
        .fill()
        .map(()=> {
          const randomIndex = Math.floor(Math.random() * copiedArr.length);
          const item = copiedArr.splice(randomIndex, 1)[0]
          return `X${item.x}Y${item.y}`;
        });
    }

    const randomSquareIDs = getRandomSquareIds(squareList, mineCount);

    const squareListWithMines = squareList.map(item => {
      return randomSquareIDs.includes(item.id)?
        {
          ...item,
          hasMine: true,
        }
        :
        item;
    })

    console.log(squareListWithMines)
    this.setState({ squareList: squareListWithMines });
  };

  getSquareClassNames = ({ isOpened, adjacentMines, hasMine }) => {
    let classes = ["square"];

    // FIXME: for dev
    if(hasMine) {
      classes = [ ...classes, "bomb" ];
    }

    if(isOpened) {
      classes = [ ...classes, "opened"];
      if(hasMine) {
        classes = [ ...classes, "bomb" ];
      } else if(adjacentMines > 0) {
        classes = [ ...classes, `number-${adjacentMines}` ];
      }
    }

    return classes.join(" ");
  }

  render() {
    const { squareList } = this.state;
    return (
      <div className="App">
        <main className="main">
          <h1 className="site-title">Minesweeper</h1>
          <ul className="board">
            { squareList.map((item) =>
              <li
                key={`${item.x}${item.y}`}
                className={this.getSquareClassNames(item)}
                onClick={this.handleSquareClick(item)}
              >
                { item.adjacentMines > 0 && item.adjacentMines }
                {/*X{item.x}Y{item.y}*/}

              </li>)
            }
          </ul>
        </main>
      </div>
    );
  }
}

export default App;
