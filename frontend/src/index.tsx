import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CloverService from './api';


type SquareProps = {
  value: null|string,
  onClick: () => void,
};

const Square = (props: SquareProps) =>
  <button className="square" onClick={props.onClick}>
    {props.value}
  </button>
;

type BoardState = {
  squares: Array<null|string>,
  xIsNext: boolean,
}

type BoardProps = {
  value: BoardState,
  onClick: (i: number) => void,
};

class Board extends React.Component<BoardProps, {}> {
  renderSquare(i: number) {
    return <Square
      value={this.props.value.squares[i]}
      onClick={() => {this.props.onClick(i)}}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

type GameState = {
  history: Array<BoardState>;
};

class Game extends React.Component<{}, GameState> {
  state: GameState = {
    history: [
      {
        squares: Array(9).fill(null),
        xIsNext: true,
      },
    ],
  };

  handleClick(i: number) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    squares[i] = current.xIsNext ? 'X' : 'O';
    const newCurrent = {
      squares: squares,
      xIsNext: !current.xIsNext,
    };
    const nextState = {
      history: history.concat([newCurrent])
    };
    console.log(nextState);
    this.setState(nextState);
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];

    const status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    return (
      <div className="game">
        <div className="game-board">
          <Board value={current} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
