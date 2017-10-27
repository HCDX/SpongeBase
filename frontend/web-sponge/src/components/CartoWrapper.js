import React, { Component } from 'react'
import { Button } from 'reactstrap'

// FIXME - package this in NPM and remove CDN!
const cartodb = window.cartodb

// store the map configuration properties in an object,
const config = {}
config.params = {
    zoomControl: true,
    center: [33.793791, 35.801777],
    zoom: 8,
    maxZoom: 15,
    minZoom: 4,
    scrollwheel: false,
    legends: true,
    infoControl: false,
    attributionControl: true
}

class CartoWrapper extends Component {
    constructor (props) {
        super(props)
        this.state = {
            map: null,
            activeLayers: {},
            layerState: {}
        }
        this._mapNode = null
        this._renderNewLayer = this._renderNewLayer.bind(this)
        this._removeLayer = this._removeLayer.bind(this)
    }

    componentDidMount () {
    // create the Leaflet map object
        if (!this.state.map) this.initMap(this._mapNode)
    }

    componentWillUnmount () {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
        this.state.map.remove()
    }

    componentWillReceiveProps (nextProps) {
        console.log('RECEIVING :', nextProps)
        // find if there are any new or removed keys fron the active layers obj

        // this.props is same as nextProps here.. i want to compare old props
        // vs new props so i dont have to deal with the state .

        // console.log('this.props.activeLayers:', this.props.activeLayers)
        // console.log('nextProps.activeLayers:', nextProps.activeLayers)
        // console.log('this.state.activeLayers:', this.state.activeLayers)
        //
        // const oldLayers = Object.keys(this.state.layerState)
        // const newLayers = Object.keys(nextProps.activeLayers)
        //
        // console.log('oldLayers: ', oldLayers)
        // console.log('newLayers: ', newLayers)
        //
        // const newDiff = newLayers.filter(x => oldLayers.indexOf(x) == -1)
        // const rmDiff = oldLayers.filter(x => newLayers.indexOf(x) == -1)
        //
        // console.log('newDiff: ', newDiff)
        // console.log('rmDiff: ', rmDiff)

        if (nextProps.deleteLayer) {
            this._removeLayer(nextProps.layerGUID)
        }
        else if (!nextProps.deleteLayer) {
            this._renderNewLayer(nextProps.layerGUID)
        }
    }
    _removeLayer (removeLayerID) {
        console.log('===DELETE===')
        const layerToRemove = this.state.layerState[removeLayerID]
        layerToRemove.remove()

        const activeLayerState = this.state.activeLayers
        delete activeLayerState[removeLayerID]

        console.log('activeLayerState: ', activeLayerState)

        this.setState({activeLayers: activeLayerState})
        this.forceUpdate()
    }

    _renderNewLayer (newLayerID) {
        const self = this
        const newLayerUrl = 'http://unhcr.cartodb.com/api/v2/viz/'
          + newLayerID + '/viz.json'

        const map = this.state.map

        cartodb.createLayer(map, newLayerUrl)
            .addTo(map)
            .on('done', function (layer) {
                // keep track of the layers in the state so we can remove them
                const layerState = self.state.layerState
                layerState[newLayerID] = layer
                self.setState({layerState: layerState})
            })
            .on('error', function (err) { console.log('error: ', err) })

        this.forceUpdate()
    }

    initMap (id) {
        const self = this

        const vizGUID = '7f739340-ae88-40fc-b2b0-14140d499310'
        const cartoVizUrl = 'http://unhcr.carto.com/api/v2/viz/'
      + vizGUID + '/viz.json'

        cartodb.createVis('mapUI', cartoVizUrl, this.props.configParams)
            .done(function (vis, layers) {
                layers[1].setInteraction(true)
                layers[1].on('featureOver',
                    function (e, latlng, pos, data, layerNumber) {
                        console.log('added new layer..')
                    })

                self.setState({ map: vis.getNativeMap() })
            })
        self.setState({activeLayers: {'province': 'x'}})
    }

    render () {
        const { width, height } = this.props
        const mapPositionStyle = {
            margin:'0 auto',
            width: width,
            height: height
        }

        return (
            <div>
                <div id="mapUI" style={mapPositionStyle}></div>
            </div>
        )
    }
}

export default CartoWrapper
