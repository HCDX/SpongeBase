import React, { Component } from 'react';

import SearchForm from './SearchForm'

class NavControl extends Component {

  render() {

    // const pCodes = {
    //   1: "Governorate",
    //   2: "Districts",
    //   3: "Municipalities",
    //   4: "Villages",
    //   5: "Informal Settlements",
    // }
    //
    /* Styles */
    const selectorStyle = {
      position: 'relative',
      marginLeft: '20px',
      marginTop: '40px'
    }

    return (
      <div
         id="layer_selector"
         className="leftcontroller"
         style={selectorStyle}>
      <nav>
        <ul>
            <li data="1">Governorate</li>
            <li data="2">District</li>
            <li data="3">Cadastrals</li>
            <li data="4">Villages/Localities</li>
            <li data="5">Informal Settlements</li>
            <li data="8">Municipalities</li>

            <li id="edu"> Education
            <ul id="education">
              <li data="6" id="school" >School</li>
            </ul>
            </li>
            <li> Health
            <ul id="health">
              <li data="7"> Primary Health Care </li>
              <li data="9"> Secondary Health Care</li>
            </ul>
          </li>
        </ul>
      </nav>
      <SearchForm/>
    </div>
    );
  }
}

export default NavControl;
