import { combineReducers } from 'redux'
import {
  REQUEST_GAME,
  RECEIVE_GAME,
  MAKE_MOVE_FAILURE,
} from './actions'

// function visibilityFilter(state = SHOW_ALL, action) {
//   switch (action.type) {
//     case SET_VISIBILITY_FILTER:
//       return action.filter
//     default:
//       return state
//   }
// }

function game(state = {}, action) {
  switch (action.type) {
    case REQUEST_GAME:
      return Object.assign({}, state, {
        is_fetching: true,
      })
    case RECEIVE_GAME:
      return Object.assign({}, state,
        {
          game_data: action.game,
          is_fetching: false,
          error: null,
        },
      )
    case MAKE_MOVE_FAILURE:
      return Object.assign({}, state,
        {
          is_fetching: false,
          error: action.error,
        },
      )
    default:
      return state
  }
}

export default game
