// npm packages
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import 'bootstrap/dist/css/bootstrap.css';

// SpongeBase app modules
import App from './App'

import spongeApp from './reducers'

let store = createStore(spongeApp)


const rootEl = document.getElementById('root')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootEl
)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
      <NextApp />,
      rootEl
    )
  })
}
