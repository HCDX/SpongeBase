const defaultState = {
    infoPanelHidden: false,
    activeLayers: {
        'province': {
            'guid': '7f739340-ae88-40fc-b2b0-14140d499310'
        }
    }
}

function spongeReducer (state = defaultState, action) {
    console.log('reducing: ', action)
    switch (action.type) {
    case 'TOGGLE_PANEL':
        return {
            ...state,
            infoPanelHidden: !state.infoPanelHidden
        }
    case 'RENDER_NEW_LAYER':
        const activeLayers = state.activeLayers || {}
        const newLayer = action.payload.newLayer

        let deleteLayer = false

        // FIXME -- somehow get the state of the checkbox.. and
        // create a REMOVE_LAYER action..
        if (activeLayers[newLayer.layerType]) {
            console.log('DELETE PART')
            delete activeLayers[newLayer.layerType]
            deleteLayer = true
        } else {
            console.log('ADD PART')
            activeLayers[newLayer.layerType] = newLayer
        }

        return {
            ...state,
            deleteLayer: deleteLayer,
            layerGUID: newLayer.layerGUID,
            infoPanelHidden: !state.infoPanelHidden,
            activeLayers: activeLayers
        }
    default:
        return state
    }
}

export default spongeReducer

// TO DO //

// show schools
// add layer

// Action -- add layer
// reducer -- ads that layer to the state
// component will mount, if it sees a new layer, it adds it in the component

// zoom in map when hiding
// show panel when its hidden

// add some unit tests

// figure out what the deal is with the indicator style calls

// dot of a school could become a book
