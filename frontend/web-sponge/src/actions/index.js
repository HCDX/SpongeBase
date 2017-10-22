
const layerLookup = {
    'schools': '430d4bb0-face-11e3-ac1a-0e230854a1cb'
}

export const togglePanel = () => {
    return { type: 'TOGGLE_PANEL' }
}

export const renderNewLayer = (layerType) => {
    const layerGUID = layerLookup[layerType]
    return {
        type: 'RENDER_NEW_LAYER',
        payload: layerGUID
    }
}
