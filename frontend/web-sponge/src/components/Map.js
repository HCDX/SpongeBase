import React, { Component } from 'react';
import L from 'leaflet';
// postCSS import of Leaflet's CSS
import 'leaflet/dist/leaflet.css';
// using webpack json loader we can import our geojson file like this
// import geojson from './fixtures/lbGeoJson.js'
import geojson from './fixtures/nyGeoJson.js'
// import local components Filter and ForkMe
import Filter from './Filter'

import jsonp from 'jsonp'


// SPONGEMAP CONFIGS ( replace these.. ) :
// URL:  http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg
// CENTER:

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
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

// array to store unique names of Brooklyn subway lines,
// this eventually gets passed down to the Filter component
let subwayLineNames = [];

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      tileLayer: null,
      geojsonLayer: null,
      geojson: null,
      subwayLinesFilter: '*',
      numEntrances: null
    };
    this._mapNode = null;
    this.updateMap = this.updateMap.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.pointToLayer = this.pointToLayer.bind(this);
    this.filterFeatures = this.filterFeatures.bind(this);
    this.filterGeoJSONLayer = this.filterGeoJSONLayer.bind(this);
  }

  componentDidMount() {
    // https://unhcr.carto.com/viz/7f739340-ae88-40fc-b2b0-14140d499310/public_map

    const baseURL = 'http://unhcr.cartodb.com/api/v2/viz/37b3bf66-ed76-11e3-abe6-0e230854a1cb/viz.json'

    jsonp(baseURL, null, function (err, data) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data);
      }
    });

    // code to run just after the component "mounts" / DOM elements are created
    // we could make an AJAX request for the GeoJSON data here if it wasn't stored locally
    this.getData();
    // create the Leaflet map object
    if (!this.state.map) this.init(this._mapNode);
  }

  componentDidUpdate(prevProps, prevState) {
    // code to run when the component receives new props or state
    // check to see if geojson is stored, map is created, and geojson overlay needs to be added
    if (this.state.geojson && this.state.map && !this.state.geojsonLayer) {
      // add the geojson overlay
      this.addGeoJSONLayer(this.state.geojson);
    }

    // check to see if the subway lines filter has changed
    if (this.state.subwayLinesFilter !== prevState.subwayLinesFilter) {
      // filter / re-render the geojson overlay
      this.filterGeoJSONLayer();
    }
  }

  componentWillUnmount() {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
    this.state.map.remove();
  }

  getData() {
    // could also be an AJAX request that results in setting state with the geojson data
    // for simplicity sake we are just importing the geojson data using webpack's json loader

    this.setState({
      numEntrances: geojson.features.length,
      geojson
    });
  }

  updateMap(e) {
    let subwayLine = e.target.value;
    // change the subway line filter
    if (subwayLine === "All lines") {
      subwayLine = "*";
    }
    // update our state with the new filter value
    this.setState({
      subwayLinesFilter: subwayLine
    });
  }

  addGeoJSONLayer(geojson) {
    // create a native Leaflet GeoJSON SVG Layer to add as an interactive overlay to the map
    // an options object is passed to define functions for customizing the layer
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature: this.onEachFeature,
      pointToLayer: this.pointToLayer,
      filter: this.filterFeatures
    });
    // add our GeoJSON layer to the Leaflet map object
    geojsonLayer.addTo(this.state.map);
    // store the Leaflet GeoJSON layer in our component state for use later
    this.setState({ geojsonLayer });
    // fit the geographic extent of the GeoJSON layer within the map's bounds / viewport
    this.zoomToFeature(geojsonLayer);
  }

  filterGeoJSONLayer() {
    // clear the geojson layer of its data
    this.state.geojsonLayer.clearLayers();
    // re-add the geojson so that it filters out subway lines which do not match state.filter
    this.state.geojsonLayer.addData(geojson);
    // fit the map to the new geojson layer's geographic extent
    this.zoomToFeature(this.state.geojsonLayer);
  }

  zoomToFeature(target) {
    // pad fitBounds() so features aren't hidden under the Filter UI element
    var fitBoundsParams = {
      paddingTopLeft: [200,10],
      paddingBottomRight: [10,10]
    };
    // set the map's center & zoom so that it fits the geographic extent of the layer
    // this.state.map.fitBounds(target.getBounds(), fitBoundsParams);
  }

  filterFeatures(feature, layer) {
    // filter the subway entrances based on the map's current search filter
    // returns true only if the filter value matches the value of feature.properties.LINE
    // const test = feature.properties.LINE.split('-').indexOf(this.state.subwayLinesFilter);
    // if (this.state.subwayLinesFilter === '*' || test !== -1) {
    //   return true;
    // }
    console.log('skipping this')
  }

  pointToLayer(feature, latlng) {
    // renders our GeoJSON points as circle markers, rather than Leaflet's default image markers
    // parameters to style the GeoJSON markers
    var markerParams = {
      radius: 4,
      fillColor: 'orange',
      color: '#fff',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.8
    };

    return L.circleMarker(latlng, markerParams);
  }

  onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NAME && feature.properties.LINE) {

      // if the array for unique subway line names has not been made, create it
      // there are 19 unique names total
      if (subwayLineNames.length < 19) {

        // add subway line name if it doesn't yet exist in the array
        feature.properties.LINE.split('-').forEach(function(line, index){
          if (subwayLineNames.indexOf(line) === -1) subwayLineNames.push(line);
        });

        // on the last GeoJSON feature
        if (this.state.geojson.features.indexOf(feature) === this.state.numEntrances - 1) {
          // use sort() to put our values in alphanumeric order
          subwayLineNames.sort();
          // finally add a value to represent all of the subway lines
          subwayLineNames.unshift('All lines');
        }
      }

      // assemble the HTML for the markers' popups (Leaflet's bindPopup method doesn't accept React JSX)
      const popupContent = `<h3>${feature.properties.NAME}</h3>
        <strong>Access to MTA lines: </strong>${feature.properties.LINE}`;

      // add our popups
      layer.bindPopup(popupContent);
    }
  }

  init(id) {
    if (this.state.map) return;
    // this function creates the Leaflet map object and is called after the Map component mounts
    let map = L.map(id, config.params);
    L.control.zoom({ position: "bottomleft"}).addTo(map);
    L.control.scale({ position: "bottomleft"}).addTo(map);

    // a TileLayer is used as the "basemap"
    const tileLayer = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(map);

    // set our state to include the tile layer
    this.setState({ map, tileLayer });
  }

  render() {
    const mapPositionStyle = {
      margin:'0 auto',
      width:'500px',
      height:'500px'
    }
    const { subwayLinesFilter } = this.state;
    return (
      <div id="mapUI" style={mapPositionStyle}>
        {
          /* render the Filter component only after the subwayLines array has been created */
          subwayLineNames.length &&
            <Filter lines={subwayLineNames}
              curFilter={subwayLinesFilter}
              filterLines={this.updateMap} />
        }
        <div ref={(node) => this._mapNode = node} id="map" />
      </div>
    );
  }
}

export default Map;
