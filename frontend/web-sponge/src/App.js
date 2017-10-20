import React, { Component } from 'react'
import { Container, Row } from 'reactstrap'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './App.css'

import InfoPanel from './components/InfoPanel'
import NavControl from './components/NavControl'
import CartoWrapper from './components/CartoWrapper'
import { togglePanel, increaseAction } from './actions'

class SpongeWrapper extends Component {
    render () {
        const {
            value,
            onIncreaseClick,
            onTogglePanel,
            infoPanelHidden
        } = this.props

        console.log('infoPanelHidden: ', infoPanelHidden)

        const infoPanel = infoPanelHidden ? ''
            :  <InfoPanel
                togglePanel={onTogglePanel}
                hidden={infoPanelHidden}
            />

        return (

            <div className="App">
                <Container>
                    <Row>
                        <NavControl/>
                        <CartoWrapper/>
                        {infoPanel}
                    </Row>
                    <Row>
                        <span>{value}</span>
                        <button onClick={onIncreaseClick}>Increase</button>
                    </Row>
                </Container>
            </div>
        )
    }
}

// Map Redux state to component props
function mapStateToProps (state) {
    console.log('state:', state)
    return {
        value: state.count,
        infoPanelHidden: state.infoPanelHidden
    }
}

// Map Redux actions to component props
function mapDispatchToProps (dispatch) {
    return {
        onIncreaseClick: () => dispatch(increaseAction),
        onTogglePanel: () => dispatch(togglePanel)
    }
}

SpongeWrapper.propTypes = {
    value: PropTypes.number,
    onIncreaseClick: PropTypes.func.isRequired
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(SpongeWrapper)

export default App
