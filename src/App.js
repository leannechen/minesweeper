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
    squareMap: new Map(),
    rows: 8,
    columns: 9,
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
    const { rows, columns } = this.state;
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

    const mineSquareIds = getRandomSquareIds(squareList, mineCount);

    // Set `hasMine`
    const myMap = new Map();
    squareList.forEach(square => {
      myMap.set(square.id, {
        ...square,
        hasMine: mineSquareIds.includes(square.id),
      });
    })

    const squareListWithAdjacentMines = Array.from(myMap.keys())
      .map(itemKey => {
        const item = myMap.get(itemKey);
        const { x, y } = item;

        const neighborWithMines =
          [
            { x: x - 1, y: y - 1 },
            { x: x, y: y - 1 },
            { x: x + 1, y: y - 1 },
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x - 1, y: y + 1 },
            { x: x, y: y + 1 },
            { x: x + 1, y: y + 1 },
          ]
          .filter(coordinate => {
            // Exclude square which is out of board range
            const { x, y } = coordinate;
            return (x > 0 && x <= columns) && (y > 0 && y <= rows);
          })
          .filter(coordinate => {
            // find squares with mine
            const { x, y } = coordinate;
            const key = `X${x}Y${y}`;
            const neighbor = myMap.get(key);
            return neighbor.hasMine;
          });

        return {
          ...item,
          adjacentMines: neighborWithMines.length,
        }
      })

    console.log(squareListWithAdjacentMines);

    this.setState({ squareList: squareListWithAdjacentMines });
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
                  key={item.id}
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
