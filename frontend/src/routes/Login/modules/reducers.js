import { combineReducers } from 'redux'
import {
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
  RECEIVE_LOGIN_FAILURE,
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
      console.log('hi')
      localStorage.setItem('creds', JSON.stringify(action.creds))
      return Object.assign({}, state,
        {
          creds: action.creds,
          is_fetching: false,
        },
      )
    case RECEIVE_LOGIN_FAILURE:
      localStorage.removeItem('creds')
      console.log(action)
      return Object.assign({}, state,
        {
          creds: {},
          is_fetching: false,
        },
      )
    default:
      return state
  }
}

export default login
