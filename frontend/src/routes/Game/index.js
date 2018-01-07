import { injectReducer } from '../../store/reducers'
import { requireAuth } from '../Login/requireAuth'

export default (store) => ({
  path : 'game/:game_id',
  onEnter : (nextState, replace) => requireAuth(store, nextState, replace),
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Game = require('./containers/GameContainer').default
      const reducer = require('./modules/reducers').default

      /*  Add the reducer to the store on key 'game'  */
      injectReducer(store, { key: 'game', reducer })

      /*  Return getComponent   */
      cb(null, Game)

    /* Webpack named bundle   */
    }, 'game')
  }
})
