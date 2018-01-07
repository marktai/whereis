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
  creds.received_at = Date.now()/1000 // in seconds
  creds.expires_at = creds.received_at + creds.expires_in
  return {
    type: RECEIVE_LOGIN,
    creds: creds,
  }
}

export const RECEIVE_LOGIN_FAILURE = 'RECEIVE_LOGIN_FAILURE'
export function receiveLoginFailure(body) {
  return {
    type: RECEIVE_LOGIN_FAILURE,
    body: body,
  }
}

const send_login = (data, dispatch) => {
  dispatch(requestLogin())
  
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
      response => {
        if (!response.ok){
          return response.json().then(json => Promise.reject(json))
        }
        return response.json()
      },
      // Do not use catch, because that will also catch
      // any errors in the dispatch and resulting render,
      // causing a loop of 'Unexpected batch number' errors.
      // https://github.com/facebook/react/issues/6895
      error => console.log(error),
    )
    .then(
      response_json => dispatch(receiveLogin(response_json)),
      error_json => dispatch(receiveLoginFailure(error_json)),
    )
}

export function refreshCreds(refresh_token) {
  const data = {
    grant_type: 'refresh_token',
    client_id: 'web',
    client_secret: 'SC8ZkC4G4L2tgDmXnffsvfTFsoZGaIaUx0QhgwAMlnKszDwHny1Gt944VilmxvE1U3bnlBNI5qX242DZ2UXet8oniUmjUEXAshpLldULaJ78Lw3YMt0XBmUIUNI3adyt',
    refresh_token,
  }
  return dispatch => send_login(data, dispatch)
}

export function fetchCreds(username, password) {
  const data = {
    grant_type: 'password',
    client_id: 'web',
    client_secret: 'SC8ZkC4G4L2tgDmXnffsvfTFsoZGaIaUx0QhgwAMlnKszDwHny1Gt944VilmxvE1U3bnlBNI5qX242DZ2UXet8oniUmjUEXAshpLldULaJ78Lw3YMt0XBmUIUNI3adyt',
    username,
    password,
  }

  return dispatch => send_login(data, dispatch)
}
