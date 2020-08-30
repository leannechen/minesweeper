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
    isCleared: false,
  },
  {
    x: 2,
    y: 1,
    id: "X2Y1",
    hasMine: false,
    adjacentMines: 0,
    isCleared: true,
  },
  {
    x: 3,
    y: 1,
    id: "X3Y1",
    hasMine: false,
    adjacentMines: 0,
    isCleared: false,
  },
  {
    x: 1,
    y: 2,
    id: "X1Y2",
    hasMine: false,
    adjacentMines: 0,
    isCleared: false,
  },
  {
    x: 2,
    y: 2,
    id: "X2Y2",
    hasMine: false,
    adjacentMines: 2,
    isCleared: true,
  },
  {
    x: 3,
    y: 2,
    id: "X3Y2",
    hasMine: false,
    adjacentMines: 1,
    isCleared: true,
  },
  {
    x: 1,
    y: 3,
    id: "X1Y3",
    hasMine: true,
    adjacentMines: 0,
    isCleared: true,
  },
  {
    x: 2,
    y: 3,
    id: "X2Y3",
    hasMine: false,
    adjacentMines: 0,
    isCleared: false,
  },
  {
    x: 3,
    y: 3,
    id: "X3Y3",
    hasMine: false,
    adjacentMines: 0,
    isCleared: false,
  },
]


class App extends React.Component {

  state = {
    squareList: [],
    squareMap: new Map(),
    rowCount: 3,
    columnCount: 3,
    mineCount: 1,
  }

  componentDidMount() {
    // compute square
    this.setupSquareList();
  }

  getNeighborCoords = (item, xMax, yMax) => {
    const { x, y } = item;
    const neighbors =
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
          return (x > 0 && x <= xMax) && (y > 0 && y <= yMax);
        })
    return neighbors;
  }

  handleSquareClick = (squareId) => () => {
    const { squareList, squareMap, columnCount, rowCount } = this.state;
    // todo: 無相鄰：開一片 [recursively seek for neighbors with no mine and clear them]
    // todo: 炸彈：開啟所有炸彈，結束遊戲

    const square = squareList.find(square => square.id === squareId);
    const { hasMine, isCleared, adjacentMines } = square;
    let newSquareList = [];

    if(isCleared) {
      return;
    }

    if(hasMine) {
      // Ends the game
      newSquareList = squareList.map(square => ({
        ...square,
        ...(square.hasMine && { isCleared: true }),
      }))
    } else {
      // Clears the square
      newSquareList = squareList.map((square) => (square.id === squareId)?
        {
          ...square,
          isCleared: true,
        }
        :
        square
      )
    }

    this.setState({ squareList: newSquareList });


    // const square = squareMap.get(squareId);
    // const newMap = new Map();
    //
    // if(!square.hasMine && square.adjacentMines === 0) {
    //   newMap.set(square.id, { ...square, isCleared: true });
    // }

    // const clearArea = (item, sourceMap, targetMap) => {
    //
    //   const neighborCoords = this.getNeighborCoords(item, columnCount, rowCount);
    //
    //   neighborCoords.forEach(coordinate => {
    //     const itemKey = `X${coordinate.x}Y${coordinate.y}`;
    //     const item = sourceMap.get(itemKey);
    //
    //     console.log({ x: item.x, y: item.y })
    //     if(item.x === 1 || item.x >= columnCount || item.y === 1 || item.y >= rowCount) {
    //       return;
    //     }
    //     if(!item.hasMine && item.adjacentMines === 0) {
    //       // clear self and open neighbors
    //       targetMap.set(itemKey, { ...item, isCleared: true });
    //       clearArea(item, sourceMap, targetMap);
    //     }
    //   });
    //
    // }
    //
    // clearArea(square, squareMap, newMap);
    //
    // console.log(newMap);
    //
    // this.setState((state) => {
    //   squareMap: new Map([...state.squareMap, newMap])
    // })

    // const newSquareList = squareList.map((square) => (square.id === squareId)?
    //   {
    //     ...square,
    //     isCleared: true,
    //   }
    //   :
    //   square
    // )
    // this.setState({ squareList: newSquareList });
  }

  setupSquareList = () => {
    const { rowCount, columnCount, mineCount } = this.state;

    const squareList = new Array(rowCount)
      .fill()
      .map((item, yIndex) => {
        return new Array(columnCount)
          .fill()
          .map((item, xIndex) => ({
            x: xIndex + 1,
            y: yIndex + 1,
            id: `X${xIndex + 1}Y${yIndex + 1}`,
            hasMine: false,
            adjacentMines: 0,
            isCleared: false,
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
    const squareMap = new Map();
    squareList.forEach(square => {
      squareMap.set(square.id, {
        ...square,
        hasMine: mineSquareIds.includes(square.id),
      });
    })

    const squareListWithAdjacentMines = Array.from(squareMap.keys())
      .map(itemKey => {
        const item = squareMap.get(itemKey);
        const neighborCoords = this.getNeighborCoords(item, columnCount, rowCount);

        // find squares with mine
        const neighborWithMines = neighborCoords.filter(coordinate => {
            const { x, y } = coordinate;
            const key = `X${x}Y${y}`;
            const neighbor = squareMap.get(key);
            return neighbor.hasMine;
          });

        return {
          ...item,
          adjacentMines: neighborWithMines.length,
        }
      })

    squareListWithAdjacentMines.forEach(square => {
      squareMap.set(square.id, square);
    })

    this.setState({ squareList: squareListWithAdjacentMines });
    this.setState({ squareMap });
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
