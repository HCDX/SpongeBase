import React, { PureComponent } from 'react';
import Leaflet from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
// import { markers, mapConfig } from './utils';

Leaflet.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/';

const mapConfig = {
  zoomControl: false,
  center: [34, 36.1],
  zoom: 9
};

const markers = [
  {
    name: 'Beirut',
    latlng: [33.893791, 35.501777]
  }, {
    name: 'Tripoli',
    latlng: [34.434595, 35.836163]
  }, {
    name: 'Tyre',
    latlng: [33.270489, 35.203764]
  }
]

class SimpleMap extends PureComponent {

  componentDidMount() {
    // https://unhcr.carto.com/viz/7f739340-ae88-40fc-b2b0-14140d499310/public_map

    // const baseURL = 'http://unhcr.cartodb.com/api/v2/viz/37b3bf66-ed76-11e3-abe6-0e230854a1cb/viz.json'
    //
    // jsonp(baseURL, null, function (err, data) {
    //   if (err) {
    //     console.error(err.message);
    //   } else {
    //     console.log(data);
    //   }
    // });
  }

  render() {
    const conf = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    }
    const position = [conf.lat, conf.lng]
    return (
      <Map center={position} zoom={conf.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <span>
              A pretty CSS3 popup. <br /> Easily customizable.
            </span>
          </Popup>
        </Marker>
      </Map>
    )
  }



  // render() {
  //   // create an array with marker components
  //   const LeafletMarkers = markers.map(marker => (
  //     <Marker position={marker.latlng} key={`marker_${marker.name}`}>
  //       <Popup>
  //         <span>{marker.name}</span>
  //       </Popup>
  //     </Marker>
  //   ));
  //
  //   const mapPositionStyle = {
  //     margin:'0 auto',
  //     width:'500px',
  //     height:'500px'
  //   }
  //   //
  //   // http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
  //   //     attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
  //
  //   return (
  //     <div className="mapUI" style={mapPositionStyle}>
  //       <Map center={mapConfig.center} zoom={mapConfig.zoom}> // className="map__reactleaflet">
  //         <TileLayer
  //           // url="http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg"
  //           // attribution="Tiles Courtesy of <a href='http://www.mapquest.com/' target='_blank'>MapQuest</a> <img src='http://developer.mapquest.com/content/osm/mq_logo.png'>"
  //           url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
  //           attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  //         />
  //         {LeafletMarkers}
  //       </Map>
  //     </div>
  //   );
  // }
  //
}

export default SimpleMap;
