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
        }
        this._mapNode = null
        this._renderNewLayer = this._renderNewLayer.bind(this)
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
        const newLayer = nextProps.activeLayers[0]
        this._renderNewLayer(newLayer)
    }

    _renderNewLayer (newLayerID) {
        console.log('renderaaangg: ', newLayerID)
        const newLayerUrl = 'http://unhcr.cartodb.com/api/v2/viz/'
          + newLayerID + '/viz.json'

        const map = this.state.map

        cartodb.createLayer(map, newLayerUrl)
            .addTo(map)
            .on('done', function (layer) { console.log('layer: ', layer) })
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
