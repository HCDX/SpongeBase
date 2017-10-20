import React, { Component } from 'react'
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

        // temporary fn name to layer schools on the map
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

    initMap (id) {
        const self = this

        const vizGUID = '7f739340-ae88-40fc-b2b0-14140d499310'
        const cartoVizUrl = 'http://unhcr.carto.com/api/v2/viz/'
      + vizGUID + '/viz.json'

        cartodb.createVis('mapUI', cartoVizUrl, config.params)
            .done(function (vis, layers) {
                layers[1].setInteraction(true)
                layers[1].on('featureOver',
                    function (e, latlng, pos, data, layerNumber) {
                        console.log('added new layer..')
                    })

                self.setState({ map: vis.getNativeMap() })
            })
    }

    _renderNewLayer () {
        const newLayerUrl = 'http://unhcr.cartodb.com/api/v2/viz/430d4bb0-face-11e3-ac1a-0e230854a1cb/viz.json'
        const map = this.state.map

        cartodb.createLayer(map, newLayerUrl)
            .addTo(map)
            .on('done', function (layer) { console.log('layer: ', layer) })
            .on('error', function (err) { console.log('error: ', err) })
    }

    render () {
        const { width, height } = this.props
        console.log('this.props', width)
        console.log('this.props', height)
        const mapPositionStyle = {
            margin:'0 auto',
            width: width,
            height: height
        }
        const buttonStyle = {
            backgroundColor: '#f41919',
            border: 'none',
            color: 'white',
            padding: '15px 32px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px'
        }
        return (
            <div>
                <button
                    onClick={this._renderNewLayer}
                    style={buttonStyle}>
        Show Schools in Lebanon
                </button>
                <div id="mapUI" style={mapPositionStyle}>
                </div>
            </div>
        )
    }
}

export default CartoWrapper
