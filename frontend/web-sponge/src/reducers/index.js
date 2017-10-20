import { combineReducers } from 'redux'

const defaultState = {
    count: 0,
    infoPanelHidden: false
}

// Reducer
function spongeReducer (state = defaultState, action) {
    const count = state.count
    switch (action.type) {
    case 'increase':
        return {
            count: count + 1
        }
    case 'TOGGLE_PANEL':
        return {
            infoPanelHidden: !state.infoPanelHidden
        }
    default:
        return state
    }
}

export default spongeReducer
