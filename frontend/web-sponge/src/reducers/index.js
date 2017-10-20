const defaultState = {
    infoPanelHidden: false
}

function spongeReducer (state = defaultState, action) {
    switch (action.type) {
    case 'TOGGLE_PANEL':
        return {
            infoPanelHidden: !state.infoPanelHidden
        }
    default:
        return state
    }
}

export default spongeReducer
