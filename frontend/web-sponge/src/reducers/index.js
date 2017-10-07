import { combineReducers } from 'redux'

const clickSomething = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

const clickSomethingElse = (state = 'BLA', action) => {
  switch (action.type) {
    case 'BLEE':
      return action.filter
    default:
      return state
  }
}

const todoApp = combineReducers({
  clickSomething,
  clickSomethingElse
})

export default todoApp
