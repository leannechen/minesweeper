import React from 'react';
import styles from './Square.module.css';

function Square(props) {
  const { x, y, adjacentMines, hasMine, isOpened, onSquareClick } = props;

  const getSquareClassNames = () => {
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

  return (
    <li
      key={`${x}${y}`}
      className={styles.square}
      onClick={onSquareClick}
    >
      { adjacentMines > 0 && adjacentMines }
    </li>
  )
}

export default Square;
