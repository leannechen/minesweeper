import React from 'react';
import styles from './GameField.module.scss';
import Square from './Square';
import imgSmile from '../img/laugh-solid.svg';
import imgSad from '../img/frown-open-solid.svg';

class GameField extends React.Component {

  state = {
    squareList: [],
    rowCount: 9,
    columnCount: 9,
    mineCount: 10,
    isGameEnded: false,
    isFirstClick: true,
  }

  componentDidMount() {
    const emptySquareList = this.getEmptySquareList();
    this.setState({ squareList: emptySquareList });
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
    const { isFirstClick } = this.state;

    const onClickSquare = () => {

      const { squareList, columnCount, rowCount } = this.state;

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
          if(targetSquare.x < 1 || targetSquare.y < 1 || targetSquare.x > columnCount || targetSquare.y > columnCount || targetSquare.isCleared) {
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

            if(targetSquare.adjacentMines > 0) {
              return ({
                list,
              })
            }

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

    if(isFirstClick) {
      this.setState({ isFirstClick: false });
      const startingSquareList = this.getFilledSquareList(squareId);
      this.setState({ squareList: startingSquareList }, () => {
        onClickSquare();
      });
    } else {
      onClickSquare();
    }

  }

  handleResetBtnClick = () => {
    const emptySquareList = this.getEmptySquareList();
    this.setState({
      squareList: emptySquareList,
      isGameEnded: false,
      isFirstClick: true
    });
  }

  /**
   * Get square list without mines and adjacent mine counts
   * @returns {{}[]} Empty square list
   */
  getEmptySquareList = () => {
    const { rowCount, columnCount } = this.state;

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

    return squareList;

  }

  /**
   * Get square list with mines and adjacent mine counts set
   * @param excludingId {string} Target square to exclude when locating mines
   * @returns {{}[]} Filled square list
   */
  getFilledSquareList = (excludingId) => {

    const { squareList, mineCount, columnCount, rowCount } = this.state;

    // Pick random squares and return their IDs
    const getRandomSquareIds = (arr, count, excludingId) => {

      let copiedArr = [...arr];

      if(count > arr.length) {
        throw new RangeError("getRandom: More elements taken than available");
      }

      if(excludingId) {
        copiedArr = copiedArr.filter(item => item.id !== excludingId);
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
    const mineSquareIds = getRandomSquareIds(squareList, mineCount, excludingId);

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

    return squareListWithAdjacentMines;
  };

  render() {
    const { squareList, isGameEnded } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button
            className={styles.btnReset}
            onClick={this.handleResetBtnClick}
          >
            { isGameEnded?
              <img src={imgSad} alt="Reset the game" className={styles.imgFace}/>
              :
              <img src={imgSmile} alt="Play the game!" className={styles.imgFace}/>
            }
          </button>
        </div>
        <ul className={styles.board}>
          { squareList.map((item) => (
            <Square
              {...item}
              key={item.id}
              isDisabled={isGameEnded}
              onSquareClick={this.handleSquareClick(item.id)}
            />
          ))
          }
        </ul>
      </div>
    );
  }
}

export default GameField;
