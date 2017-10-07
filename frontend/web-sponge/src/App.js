import React, { Component } from 'react';
import './App.css';

import { clickSomething } from './actions'

class App extends Component {
  _clickSomething(e) {
    clickSomething()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title"> asfsfs</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <button
          onClick = {this.clickSomething}
          ></button>

      </div>
    );
  }
}

export default App;
