import React from 'react';
import styles from './App.module.scss';
import Square from './components/Square';
import imgSmile from './img/laugh-solid.svg';

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
    rowCount: 9,
    columnCount: 9,
    mineCount: 10,
    isGameEnded: false,
  }

  componentDidMount() {
    // compute square
    this.setupSquareList();
  }

  getNeighborCoords = (item, xMax, yMax, isConsideringEdge = true) => {
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
      ];

    return isConsideringEdge?
      // Exclude square which is out of board range
      neighbors.filter(coordinate => {
        const { x, y } = coordinate;
        return (x > 0 && x <= xMax) && (y > 0 && y <= yMax);
      })
      :
      neighbors;
  }

  handleSquareClick = (squareId) => () => {
    const { squareList, columnCount, rowCount } = this.state;
    // todo: 無相鄰：開一片 [recursively seek for neighbors with no mine and clear them]
    // todo: 炸彈：開啟所有炸彈，結束遊戲

    const square = squareList.find(square => square.id === squareId);
    const { hasMine, isCleared, adjacentMines } = square;
    let newSquareList = [];
    let copiedSquareList = [...squareList];

    if(isCleared) {
      return;
    }

    if(hasMine) {
      // Ends the game
      newSquareList = squareList.map(square => ({
        ...square,
        ...(square.hasMine && { isCleared: true }),
      }))
      this.setState(({ isGameEnded: true }));
    } else if(adjacentMines === 0) {
      // Clear the square itself along with adjacent squares
      // (as long as they do not have any adjacent mine and not exceeding board range)
      const clearSquares = ({ targetSquare, list }) => {
        // Check is at the edge of the board
        if(targetSquare.x < 1 || targetSquare.y < 1 || targetSquare.x > columnCount || targetSquare.y > columnCount || targetSquare.isCleared || targetSquare.adjacentMines > 0) {
          return ({
            targetSquare, // 不會用到
            list, // final result
          })
        } else {
          // Clear itself
          const targetSquareIndex = list.findIndex(square => square.x === targetSquare.x && square.y === targetSquare.y);
          list[targetSquareIndex] = {
            ...targetSquare,
            isCleared: true,
          };

          // Clear neighbors
          const neighborCoords = this.getNeighborCoords(targetSquare, columnCount, rowCount, false);
          neighborCoords.forEach((neighborCoord) => {
            const neighbor = list.find(square => square.x === neighborCoord.x && square.y === neighborCoord.y);
            return neighbor? clearSquares({ targetSquare: neighbor, list: list }): ({ list: list });
          })

        }

        return list;
      }

      const clearedList = clearSquares({ targetSquare: square, list: copiedSquareList });

      newSquareList = clearedList;
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

    // Get squares's IDs with mine
    const mineSquareIds = getRandomSquareIds(squareList, mineCount);

    // Set `hasMine` in Map type
    const squareMap = new Map();
    squareList.forEach(square => {
      squareMap.set(square.id, {
        ...square,
        hasMine: mineSquareIds.includes(square.id),
      });
    })

    // Calculate adjacent mines
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

    this.setState({ squareList: squareListWithAdjacentMines });
  };

  render() {
    const { squareList } = this.state;
    return (
      <div className="App">
        <main className={styles.main}>
          <h1 className={styles.siteTitle}>Minesweeper</h1>
          <p>Game ended: {String(this.state.isGameEnded)}</p>
          <div>
            <div>
              <button
                className={styles.btnReset}
                onClick={() => {}}
              >
                <img src={imgSmile} alt="" className={styles.imgFace}/>
              </button>
            </div>
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
          </div>
        </main>
      </div>
    );
  }
}

export default App;
