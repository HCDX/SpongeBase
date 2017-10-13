import React, { Component } from 'react';

import './App.css';

import InfoPanel from './components/InfoPanel'
import NavControl from './components/NavControl'

import CartoWrapper from './components/CartoWrapper';

import { Container, Row } from 'reactstrap'

class App extends Component {

  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <NavControl/>
            <CartoWrapper/>
            <InfoPanel/>
          </Row>
        </Container>
      </div>
    )
  }
}

export default App;
