import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Chessdiagram from 'react-chessdiagram';
import { refresh_creds_promise } from '../../Login/requireAuth';

const propTypes = {
  creds_state: PropTypes.object,
  game_id: PropTypes.number.isRequired,
  game_state: PropTypes.object.isRequired,
  fetchGame: PropTypes.func.isRequired,
  makeMove: PropTypes.func.isRequired,
}


const lightSquareColor = '#2492FF'; // light blue
const darkSquareColor = '#005EBB'; // dark blue
const flip = false;


class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
    }
  }


  componentDidMount() {
    if (typeof(this.props.creds_state) !== 'undefined'){
      this.props.fetchGame(this.props.creds_state.creds)
    }

    console.log('setting up socket')

    this.state.socket = new WebSocket('ws://localhost/ws/listen/' + this.props.game_id)
    this.state.socket.onmessage = () => {
      console.log('updated from websockets')
      this.props.fetchGame(this.props.creds_state.creds)
    }
  }

  render() {
    return (
      <div style={{ margin: '0 auto' }} >
        <button className='btn btn-primary' onClick={() => {this.props.fetchGame(this.props.creds_state.creds)}} style={{margin: '12px'}}>
          Update Game: {this.props.game_id}
        </button>
        <Chessdiagram 
          flip={this.props.flip} 
          fen={this.props.game_state.game_data && this.props.game_state.game_data.board.fen}
          squareSize={30} 
          lightSquareColor={lightSquareColor} 
          darkSquareColor={darkSquareColor} 
          onMovePiece={(piece, from_square, to_square) => {this.props.makeMove(piece, from_square, to_square, this.props.creds_state.creds)}}
        />
      </div>
    )
  }
}


Game.propTypes = propTypes

export default Game
