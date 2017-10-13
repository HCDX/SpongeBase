import React, { Component } from 'react'
const cartodb = window.cartodb

// store the map configuration properties in an object,
let config = {};
config.params = {
  zoomControl: true,
  center: [33.893791, 35.501777], // [40.655769,-73.938503],
  zoom: 9,
  maxZoom: 19000,
  minZoom: 0,
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true
};
config.tileLayer = {
  uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  maxZoom: 20,
  minZoom: 10,
  params: {
    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    id: '',
    accessToken: ''
  }
};

class CartoWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
    };
    this._mapNode = null;

    // temporary fn name to layer schools on the map
    this.onRenderSchools = this.onRenderSchools.bind(this);
  }

  componentDidMount() {
    // create the Leaflet map object
    if (!this.state.map) this.initMap(this._mapNode);
  }

  componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
    this.state.map.remove();
  }

  initMap(id) {
    const self = this

    // const vizGUID = '7f739340-ae88-40fc-b2b0-14140d499310'
    const vizGUID = '2b13c956-e7c1-11e2-806b-5404a6a683d5'


    const cartoVizUrl = 'http://documentation.carto.com/api/v2/viz/'
      + vizGUID + '/viz.json'
    cartodb.createVis('map', cartoVizUrl, config.params)
    .done(function(vis, layers) {
      // layer 0 is the base layer, layer 1 is cartodb layer
      // when setInteraction is disabled featureOver is triggered
      layers[1].setInteraction(true);
      layers[1].on('featureOver',
        function(e, latlng, pos, data, layerNumber) {
          console.log(e, latlng, pos, data, layerNumber);
      });

      self.setState({ map: vis.getNativeMap() });

    });
  }

  onRenderSchools () {

    const map = this.state.map

    const newLayer = 'http://unhcr.cartodb.com/api/v2/viz/430d4bb0-face-11e3-ac1a-0e230854a1cb/viz.json'

    cartodb.createLayer(map, newLayer )
      .addTo(map)
      .on('done', function(layer) { console.log('layer: ', layer) })
      .on('error', function(err) { alert("some error occurred: " + err) })
  }

  render() {

    const mapPositionStyle = {
      margin:'0 auto',
      width:'500px',
      height:'500px'
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
    // const { subwayLinesFilter } = this.state;
    return (
      <div>
      <button
        onClick={this.onRenderSchools}
        style={buttonStyle}>
        Show Schools in Lebanon
      </button>
      <div id="mapUI" style={mapPositionStyle}>
        <div ref={(node) => this._mapNode = node} id="map" />
      </div>
      </div>
    );
  }
}

export default CartoWrapper;


  // this is from the old code base..
    // <!-- <div id="page-wrap" title="DOG fetched this"></div> -->
    // <script type="infowindow/html" id="infowindow_template">
    //     {% raw %}
    //     <span> custom </span>
    //       <div className="cartodb-popup custom_infowindow" id="popid" >
    //
    //         <a href="#close" className="cartodb-popup-close-button close">x</a>
    //
    //          <div className="cartodb-popup-content-wrapper" >
    //            <div>
    //              <!-- content.data contains the field info -->
    //              <h4>{{content.data.p_code}}</h4>
    //            </div>
    //           <div id="id1"></div>
    //          </div>
    //          <div className="cartodb-popup-tip-container"></div>
    //       </div>
    //     {% endraw %}
    // </script>
