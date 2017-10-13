import React, { Component } from 'react';

import './App.css';
// import './Leaflet.css'

import { clickSomething } from './actions'

import NavControl from './components/NavControl'
import InfoPanel from './components/InfoPanel'
import SearchForm from './components/SearchForm'

import SimpleMap from './components/SimpleMap';
import CartoWrapper from './components/CartoWrapper';


class App extends Component {
  _clickSomething(e) {
    clickSomething()
  }

  render() {

    const cartoWrapper = <CartoWrapper/>

    /* Styles */
    const selectorStyle = {
      position: 'relative',
      marginLeft: '20px',
      marginTop: '40px'
    }

    const navControl = <NavControl/>
    const rightInfoPanel = <InfoPanel/>
    const searchForm = <SearchForm/>

    const appContent = <div>
      {cartoWrapper}
      <div
             id="layer_selector"
             className="leftcontroller"
             style={selectorStyle}>
         {navControl}
         {searchForm}
       </div>
      {rightInfoPanel}
    </div>

    return (
      <div className="App">
        {appContent}
      </div>
    );
  }
}

export default App;
