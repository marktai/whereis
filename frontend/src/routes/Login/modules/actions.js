import fetch from 'cross-fetch'

// ------------------------------------
// Actions
// ------------------------------------

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export function requestLogin() {
  return {
    type: REQUEST_LOGIN,
  }
}

export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export function receiveLogin(creds) {
  return {
    type: RECEIVE_LOGIN,
    creds: creds,
    received_at: Date.now(),
  }
}


// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))
export function fetchCreds(username, password) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestLogin())

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.


    const data = {
      grant_type: 'password',
      client_id: 'web',
      client_secret: 'SC8ZkC4G4L2tgDmXnffsvfTFsoZGaIaUx0QhgwAMlnKszDwHny1Gt944VilmxvE1U3bnlBNI5qX242DZ2UXet8oniUmjUEXAshpLldULaJ78Lw3YMt0XBmUIUNI3adyt',
      username,
      password,
    }

    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    return fetch(
      `/api/o/token/`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
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

        dispatch(receiveLogin(json))
      )
  }
}
