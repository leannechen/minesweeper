import React from 'react';
import classNames from 'classnames/bind';
import styles from './Square.module.scss';

const cx = classNames.bind(styles);

function Square(props) {
  const { x, y, adjacentMines, hasMine, isOpened, onSquareClick } = props;

  return (
    <li
      key={`${x}${y}`}
      className={cx('square', `number-${adjacentMines}`, {
        'opened': isOpened,
        'hasMine': hasMine,
      })}
      onClick={onSquareClick}
    >
      { adjacentMines > 0 && adjacentMines }
    </li>
  )
}

export default Square;
