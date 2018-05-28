
const layerLookup = {
    'schools': '430d4bb0-face-11e3-ac1a-0e230854a1cb',
    'health': 'b0d8c1de-078c-11e6-a501-0e3ff518bd15'
}

export const togglePanel = () => {
    return { type: 'TOGGLE_PANEL' }
}

export const renderNewLayer = (layerType) => {
    const layerGUID = layerLookup[layerType]
    return {
        type: 'RENDER_NEW_LAYER',
        payload: {
            newLayer: {
                layerType: layerType,
                layerGUID: layerGUID
            },
        }
    }
}
