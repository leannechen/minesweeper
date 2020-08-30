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
    const mines = 10;

    const itemList = new Array(rows)
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

    const pickRandom = (arr, count) => {
      let copiedArr = [...arr];
      if(count > arr.length) {
        throw new RangeError("getRandom: More elements taken than available");
      }
      return [...Array(count)]
        .map(()=> {
          const randomIndex = Math.floor(Math.random() * copiedArr.length);
          const item = copiedArr.splice(randomIndex, 1)[0]
          return `X${item.x}Y${item.y}`;
        });
    }

    const randomItemIDs = pickRandom(itemList, 10);
    console.log(randomItemIDs);

    const itemListWithMines = itemList.map(item => {
      return randomItemIDs.includes(item.id)?
        {
          ...item,
          hasMine: true,
        }
        :
        item;
    })

    console.log(itemListWithMines)
    // todo: distribute mines

    this.setState({ squareList: itemListWithMines });
  };

  getSquareClassNames = ({ isOpened, adjacentMines, hasMine }) => {
    let classes = ["square"];
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
