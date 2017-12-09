import React from 'react'
import PropTypes from 'prop-types'

import Chessdiagram from 'react-chessdiagram';
import axios from 'axios';

const lightSquareColor = '#2492FF'; // light blue
const darkSquareColor = '#005EBB'; // dark blue
const flip = false;
const squareSize = 30;
let position = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b HAha - 0 1'; // starting position



export const Game = ({ game, increment, doubleAsync }) => (
  <div style={{ margin: '0 auto' }} >
    <h2>Game: {game}</h2>
    <button className='btn btn-primary' onClick={increment}>
      Increment
    </button>
    {' '}
    <button className='btn btn-secondary' onClick={doubleAsync}>
      Double (Async)
    </button>
    <Chessdiagram 
      flip={flip} 
      fen={position} 
      squareSize={squareSize} 
      lightSquareColor={lightSquareColor} 
      darkSquareColor={darkSquareColor} 
      onMovePiece={onMovePiece}
    />
  </div>
)

function onMovePiece(piece, fromSquare, toSquare) {
  let message = 'You moved ' + piece + fromSquare + ' to ' + toSquare + ' !';
  const uci = fromSquare + toSquare;
  console.log(message);
  let data = {uci};
  let config = {
    headers: {
      Authorization: 'Bearer KzIezkfjuDm3np4i0fbcjUNioTwMfP',
    },
  };
  axios.post('/api/games/14/move/', data, config).then(function(response){
    console.log(response);
    position = response.data.board.fen;

  });
}

Game.propTypes = {
  game: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  doubleAsync: PropTypes.func.isRequired,
}

export default Game
