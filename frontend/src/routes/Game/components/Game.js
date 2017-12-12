import React from 'react'
import PropTypes from 'prop-types'

import Chessdiagram from 'react-chessdiagram';

const propTypes = {
  creds_state: PropTypes.object.isRequired,
  game_id: PropTypes.number.isRequired,
  game_state: PropTypes.object.isRequired,
  fetchGame: PropTypes.func.isRequired,
  makeMove: PropTypes.func.isRequired,
}


const lightSquareColor = '#2492FF'; // light blue
const darkSquareColor = '#005EBB'; // dark blue
const flip = false;

export const Game = ({ creds_state, game_id, game_state, fetchGame, makeMove }) => (
  <div style={{ margin: '0 auto' }} >
    {/*<h2>Game: {game}</h2>*/}
    <button className='btn btn-primary' onClick={() => {fetchGame(creds_state.creds)}} style={{margin: '12px'}}>
      Update Game: {game_id}
    </button>
    <Chessdiagram 
      flip={flip} 
      fen={game_state.game_data && game_state.game_data.board.fen}
      squareSize={30} 
      lightSquareColor={lightSquareColor} 
      darkSquareColor={darkSquareColor} 
      // onMovePiece={console.log}
      onMovePiece={(piece, from_square, to_square) => {makeMove(piece, from_square, to_square, creds_state.creds)}}
    />
  </div>
)


Game.propTypes = propTypes

export default Game
