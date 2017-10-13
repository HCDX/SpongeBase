import React, { Component } from 'react';

class InfoPanel extends Component {

  render() {

    return (
      <form className="form-inline">
            <input type="text" id="searchTxt" placeholder="Search..." />
            <input type="button" className="btn btn-info" value="Go" onClick="searchFunction()" id="btnSearch" />
        </form>
    )
  }
}

export default InfoPanel;
