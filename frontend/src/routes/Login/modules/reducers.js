import { combineReducers } from 'redux'
import {
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
} from './actions'

// function visibilityFilter(state = SHOW_ALL, action) {
//   switch (action.type) {
//     case SET_VISIBILITY_FILTER:
//       return action.filter
//     default:
//       return state
//   }
// }

function login(state = {}, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return Object.assign({}, state, {
        is_fetching: true,
      })
    case RECEIVE_LOGIN:
      return Object.assign({}, state,
        {
          creds: action.creds,
          is_fetching: false,
          lastUpdated: action.received_at,
        },
      )
    default:
      return state
  }
}

export default login
