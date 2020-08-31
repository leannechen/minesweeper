import React from 'react';
import styles from './App.module.scss';
import GameField from './components/GameField';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <main className={styles.main}>
          <h1 className={styles.siteTitle}>Minesweeper</h1>
          <GameField/>
        </main>
      </div>
    );
  }
}

export default App;
