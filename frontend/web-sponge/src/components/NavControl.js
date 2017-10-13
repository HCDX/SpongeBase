import React, { Component } from 'react'

import SearchForm from './SearchForm'

class NavControl extends Component {

  render() {

    const pCodes = {
      1: "Governorate",
      2: "Districts",
      3: "Municipalities",
      4: "Villages",
      5: "Informal Settlements",
      8: "Municipalities",
    }

    // const indicators = {
    //   6: "Scools",
    //   7: "Primary Health Care",
    //   9: "Seconday Health Care"
    // }

    /* Styles */
    const selectorStyle = {
      position: 'relative',
      marginTop: '40px',
      marginRight: '20px'
    }

    const geoOptions = Object.keys(pCodes).map(c =>{
      return <li
        onClick={(e) => console.log('e: ', e)}
        key={ 'pcode-' + c}
        data={c}> {pCodes[c]}
       </li>
    })

    // const indicatorOptions = Object.keys(indicators).map(ind =>{
    //   return <li data={ind}> {indicators[ind]} </li>
    // })

    return (
      <div
         id="layer_selector"
         className="leftcontroller"
         style={selectorStyle}>
      <nav>
        <ul>
          {geoOptions}
        </ul>
      </nav>
      <SearchForm/>
    </div>
    )
  }
}

export default NavControl
