import React from 'react';
import classNames from 'classnames/bind';
import styles from './Square.module.scss';

const cx = classNames.bind(styles);

function Square(props) {
  const { x, y, adjacentMines, hasMine, isCleared, isDisabled, onSquareClick } = props;

  const handleClick = () => {
    if(!isDisabled) {
      onSquareClick();
    }
  }

  return (
    <li
      key={`${x}${y}`}
      className={cx('square', `number-${adjacentMines}`, {
        'opened': isCleared,
        'hasMine': isCleared && hasMine,
      })}
      onClick={handleClick}
    >
      { (isCleared && adjacentMines > 0 && !hasMine) && adjacentMines }
    </li>
  )
}

export default Square;
