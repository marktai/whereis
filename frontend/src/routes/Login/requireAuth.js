import { refreshCreds } from './modules/actions'

export const requireAuth = (store, nextState, replace) => {
  // no creds in state
  if (typeof(store.getState().creds) === 'undefined' || Object.keys(store.getState().creds.creds).length === 0) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
    return
  }
}
