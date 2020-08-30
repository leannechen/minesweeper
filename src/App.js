import React from 'react';
import styles from './App.module.css';
import Square from './components/Square';

const mockData = [
  {
    x: 1,
    y: 1,
    id: "X1Y1",
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 2,
    y: 1,
    id: "X2Y1",
    hasMine: false,
    adjacentMines: 0,
    isOpened: true,
  },
  {
    x: 3,
    y: 1,
    id: "X3Y1",
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 1,
    y: 2,
    id: "X1Y2",
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 2,
    y: 2,
    id: "X2Y2",
    hasMine: false,
    adjacentMines: 2,
    isOpened: true,
  },
  {
    x: 3,
    y: 2,
    id: "X3Y2",
    hasMine: false,
    adjacentMines: 1,
    isOpened: true,
  },
  {
    x: 1,
    y: 3,
    id: "X1Y3",
    hasMine: true,
    adjacentMines: 0,
    isOpened: true,
  },
  {
    x: 2,
    y: 3,
    id: "X2Y3",
    hasMine: false,
    adjacentMines: 0,
    isOpened: false,
  },
  {
    x: 3,
    y: 3,
    id: "X3Y3",
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

  handleSquareClick = (squareId) => () => {
    const { squareList } = this.state;
    const newSquareList = squareList.map((square) => (square.id === squareId)?
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
      const hasMine = randomSquareIDs.includes(item.id);
      // let
      // todo: cal adjacent mine
      return {
        ...item,
        hasMine,
      }
    })

    console.log(squareListWithMines)
    this.setState({ squareList: squareListWithMines });
  };

  render() {
    const { squareList } = this.state;
    return (
      <div className="App">
        <main className={styles.main}>
          <h1 className={styles.siteTitle}>Minesweeper</h1>
          <ul className={styles.board}>
            { squareList.map((item) => (
                <Square
                  {...item}
                  onSquareClick={this.handleSquareClick(item.id)}
                />
              ))
            }
          </ul>
        </main>
      </div>
    );
  }
}

export default App;
