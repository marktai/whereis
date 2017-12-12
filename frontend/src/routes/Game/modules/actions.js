import fetch from 'cross-fetch'

// ------------------------------------
// Actions
// ------------------------------------

export const REQUEST_GAME = 'REQUEST_GAME'
export function requestGame(game_id) {
  return {
    type: REQUEST_GAME,
    game_id,
  }
}

export const RECEIVE_GAME = 'RECEIVE_GAME'
export function receiveGame(game_id, game) {
  return {
    type: RECEIVE_GAME,
    game_id,
    game,
    received_at: Date.now(),
  }
}


// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))
export function fetchGame(game_id, creds) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestGame(game_id))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fetch(
      `/api/me/games/${game_id}/`, 
      {
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
        },
      },
    )
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occurred.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveGame(game_id, json))
      )
  }
}

export function makeMove(game_id, from_square, to_square, creds) {
  return function(dispatch){
    dispatch(requestGame(game_id))


    const uci = `${from_square}${to_square}`

    return fetch(
      `/api/me/games/${game_id}/move`, 
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creds.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uci,
        }),
      },
    )
      .then(
        response => response.json(),
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => console.log('An error occurred.', error)
      )
      .then(json =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.

        dispatch(receiveGame(game_id, json))
      )
  }
}
