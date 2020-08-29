import React from 'react';
import './App.css';

const mockData = [
  {
    x: 1,
    y: 1,
    hasMine: false,
    showNumber: 0,
    isOpened: false,
  },
  {
    x: 2,
    y: 1,
    hasMine: false,
    showNumber: 0,
    isOpened: true,
  },
  {
    x: 3,
    y: 1,
    hasMine: false,
    showNumber: 0,
    isOpened: false,
  },
  {
    x: 1,
    y: 2,
    hasMine: false,
    showNumber: 0,
    isOpened: false,
  },
  {
    x: 2,
    y: 2,
    hasMine: false,
    showNumber: 2,
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
    hasMine: true,
    showNumber: 0,
    isOpened: true,
  },
  {
    x: 2,
    y: 3,
    hasMine: false,
    showNumber: 0,
    isOpened: false,
  },
  {
    x: 3,
    y: 3,
    hasMine: false,
    showNumber: 0,
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

  setupSquareList = () => {
    const columns = 9;
    const rows = 8;
    const mines = 10;

    const nestedArr = new Array(rows)
      .fill()
      .map((item, yIndex) => {
        return new Array(columns)
          .fill()
          .map((item, xIndex) => ({
            x: xIndex + 1,
            y: yIndex + 1,
            hasMine: false,
            showNumber: 0,
            isOpened: false,
          }))
      })

    this.setState({ squareList: nestedArr.flat() });
    console.log(nestedArr.flat());

    // flatten nestedArr
  };

  getSquareClassNames = ({ isOpened, showNumber, hasMine }) => {
    let classes = ["square"];
    if(isOpened) {
      classes = [ ...classes, "opened"];
      if(hasMine) {
        classes = [ ...classes, "bomb" ];
      } else if(showNumber > 0) {
        classes = [ ...classes, `number-${showNumber}` ];
      }
    }

    return classes.join(" ");
  }

  render() {
    return (
      <div className="App">
        <main className="main">
          <h1 className="site-title">Minesweeper</h1>
          <ul className="board">
            { mockData.map((item) =>
              <li
                key={`${item.x}${item.y}`}
                className={this.getSquareClassNames(item)}
              >
                { item.showNumber > 0 && item.showNumber }
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
