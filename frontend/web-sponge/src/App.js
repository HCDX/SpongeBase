import React, { Component } from 'react';
import './App.css';

import { clickSomething } from './actions'

class App extends Component {
  _clickSomething(e) {
    clickSomething()
  }

  render() {

    const cartoScript = ''
    // <!-- <div id="page-wrap" title="DOG fetched this"></div> -->
    // <script type="infowindow/html" id="infowindow_template">
    //     {% raw %}
    //     <span> custom </span>
    //       <div class="cartodb-popup custom_infowindow" id="popid" >
    //
    //         <a href="#close" class="cartodb-popup-close-button close">x</a>
    //
    //          <div class="cartodb-popup-content-wrapper" >
    //            <div>
    //              <!-- content.data contains the field info -->
    //              <h4>{{content.data.p_code}}</h4>
    //            </div>
    //           <div id="id1"></div>
    //          </div>
    //          <div class="cartodb-popup-tip-container"></div>
    //       </div>
    //     {% endraw %}
    // </script>

    const selectorStyle = {
      position: 'relative',
      marginLeft: '2em',
      marginTop: '4em'
    }
    const appContent = <div>

    <div class="map" id="map"></div>
    <div id="layer_selector" class="cartodb-infobox" style={selectorStyle}>

  <nav>
       <ul>
      <li data="1">Governorate</li>
            <li data="2">District</li>
            <li data="3">Cadastrals</li>
      <li data="8">Municipalities</li>
            <li data="4">Villages/Localities</li>
            <li data="5">Informal Settlements</li>


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
    <form class="form-inline">
        <input type="text" id="searchTxt" placeholder="Search..." />
        <input type="button" class="btn btn-info" value="Go" onclick="searchFunction()" id="btnSearch" />
    </form>
    </div>
    {cartoScript}
    <div class="sidepanel">
        <div class="wrapper">
            <div class="context subheader">
                <p>A joint UNHCR/UNICEF innovation project</p>
            </div>
            <h1 class="text-muted">SpongeBase visualization</h1>
            <p>The number of Syrians registered as refugees in Lebanon after fleeing war in their country has surpassed one million. Refugees from Syria, now equal a quarter of Lebanon's resident population. Most of them live in poverty and depend on aid for survival.</p>

            <h4 class="text-muted">DESCRIPTION</h4>
            <p>This interactive map collates available information from different data sources and links them to a location whether a governorate,a district, a village or even a small camp.</p>
            <h4 class="text-muted">SOURCES</h4>
            <p>
                <a href="http://data.unhcr.org/syrianrefugees/country.php?id=122">UNHCR Data Portal</a>
                <a href="http://activityinfo.org">Activity Info</a>
            </p>
        </div>
    <div id="page-wrap" class="wrapper">
            <ul class="nav nav-tabs">
              <li class="active"><a href="#ai_data" data-toggle="tab">Humanitarian Data</a></li>
              <li><a href="#social" data-toggle="tab">Social</a></li>
            </ul>
            <div class="tab-content">
                <div id="ai_data" class="tab-pane active"></div>
                <div id="social" class="tab-pane">
                    <div id="twitter-feed"></div>
                </div>
            </div>
        </div>
    <div class="context footer">
            <p>Visit the Inter-agency information sharing webportal <a href="http://data.unhcr.org/syrianrefugees/country.php?id=122">Here</a></p>
        </div>
    </div>
  </div>

    return (
      <div className="App">
        {appContent}
      </div>
    );
  }
}

export default App;
