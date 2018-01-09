import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Chessdiagram from 'react-chessdiagram'
import { refresh_creds_promise } from '../../Login/requireAuth'

import '../styles/game.scss'

const propTypes = {
  creds_state: PropTypes.object,
  game_id: PropTypes.number.isRequired,
  game_state: PropTypes.object.isRequired,
  fetchGame: PropTypes.func.isRequired,
  makeMove: PropTypes.func.isRequired,
}


const lightSquareColor = '#2492FF' // light blue
const darkSquareColor = '#005EBB' // dark blue
const squareSize = 45 // dark blue
const flip = false


class Game extends Component {
  constructor(props) {
    super(props)
    this.socket = null
    this.last_game_id = null
    this.state = {
      turn_color: 'White',
      promotion_enabled: false,
      promotion_piece: 'q',
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  updateAndSetWebsocket(nextProps){
    this.last_game_id = nextProps.game_id

    if (typeof(this.props.creds_state) !== 'undefined'){
      this.props.fetchGame(this.props.creds_state.creds)
    }
    this.socket = new WebSocket(`ws://${window.location.host}/ws/listen/${this.props.game_id}`)
    this.socket.onmessage = () => {
      console.log('updated from websockets')
      this.props.fetchGame(this.props.creds_state.creds)
    }
  }

  componentDidMount(){
      this.updateAndSetWebsocket(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.game_id !== this.last_game_id){
      this.updateAndSetWebsocket(nextProps)
    }
    if (typeof(nextProps.game_state.game_data) !== 'undefined'){
      this.setState({
        turn_color: nextProps.game_state.game_data.turn_count % 2 == 0 ? 'White' : 'Black'
      })
    }
  }

  handleInputChange(event) {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;

    console.log(name, value)
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div style={{ margin: '0 auto' }} >
        <button className='btn btn-primary' onClick={() => {this.props.fetchGame(this.props.creds_state.creds)}} style={{margin: '12px'}}>
          Update Game: {this.props.game_id}
        </button>
        <div className={`player-turn ${this.state.turn_color}`}>{this.state.turn_color}'s Turn</div>
        <div style={{ padding: '4px' }}>
          <Chessdiagram 
            flip={this.props.flip} 
            fen={this.props.game_state.game_data && this.props.game_state.game_data.board.fen}
            squareSize={squareSize} 
            lightSquareColor={lightSquareColor} 
            darkSquareColor={darkSquareColor} 
            onMovePiece={(piece, from_square, to_square) => {this.props.makeMove(piece, from_square, to_square, this.state.promotion_enabled ? this.state.promotion_piece : '', this.props.creds_state.creds)}}
          />
        </div>
        <div className='error-message'>{this.props.game_state.error ? this.props.game_state.error : ''}</div>

        <div>
          <div>Promotion selector</div>
          <input
            name='promotion_enabled'
            type='checkbox'
            checked={this.state.promotion_enabled}
            onChange={this.handleInputChange}
          />
          <select 
            name='promotion_piece'
            value={this.state.promotion_piece} 
            onChange={this.handleInputChange}
          >
            <option value='n'>Knight</option>
            <option value='b'>Bishop</option>
            <option value='r'>Rook</option>
            <option value='q'>Queen</option>
          </select>
        </div>

      </div>
    )
  }
}


Game.propTypes = propTypes

export default Game
