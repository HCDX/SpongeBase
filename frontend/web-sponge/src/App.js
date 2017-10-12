import React, { Component } from 'react';
import Map from './components/Map';

import './App.css';

import { clickSomething } from './actions'

import NavControl from './components/NavControl'
import InfoPanel from './components/InfoPanel'
import SearchForm from './components/SearchForm'
// import CartoWrapper from './components/CartoWrapper'

class App extends Component {
  _clickSomething(e) {
    clickSomething()
  }

  render() {

    const cartoWrapper = <Map/> //// <CartoWrapper />

    /* Styles */
    const selectorStyle = {
      position: 'relative',
      marginLeft: '20px',
      marginTop: '40px'
    }

    const navControl = <NavControl/>
    const rightInfoPanel = <InfoPanel/>
    const searchForm = <SearchForm/>

    // <div
    //        id="layer_selector"
    //        className="leftcontroller"
    //        style={selectorStyle}>
    //    {navControl}
    //    {searchForm}
    //  </div>
    // {rightInfoPanel}

    const appContent = <div>
      {cartoWrapper}
    </div>

    return (
      <div className="App">
        {appContent}
      </div>
    );
  }
}

export default App;
