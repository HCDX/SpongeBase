import React, { Component } from 'react';

import './App.css';
// import './Leaflet.css'

import { clickSomething } from './actions'

import InfoPanel from './components/InfoPanel'
import SearchForm from './components/SearchForm'
import NavControl from './components/NavControl'

import CartoWrapper from './components/CartoWrapper';

import { Container, Row, Col } from 'reactstrap'

class App extends Component {
  _clickSomething(e) {
    clickSomething()
  }

  render() {

    const appContent = <Container>
      <Row>
        <NavControl/>
        <CartoWrapper/>
        <InfoPanel/>
      </Row>
    </Container>
    return (
      <div className="App">
        {appContent}
      </div>
    );
  }
}

export default App;
