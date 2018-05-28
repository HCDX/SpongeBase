import React, { Component } from 'react'
import { Container, Row } from 'reactstrap'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './App.css'

import InfoPanel from './components/InfoPanel'
import NavControl from './components/NavControl'
import CartoWrapper from './components/CartoWrapper'
import * as Actions from './actions'

class SpongeWrapper extends Component {
    render () {
        const {
            infoPanelHidden,
            activeLayers,
            actions,
            deleteLayer,
            layerGUID
        } = this.props

        const infoPanel = infoPanelHidden ? ''
            : <InfoPanel
                togglePanel={actions.togglePanel}
                hidden={infoPanelHidden}
            />

        const cartoWrapper = <CartoWrapper
            hidden={infoPanelHidden}
            activeLayers={activeLayers}
            width={infoPanelHidden ? '600px' : '500px'}
            height={infoPanelHidden ? '600px' : '500px'}
            deleteLayer={deleteLayer}
            layerGUID={layerGUID}
        />

        return (

            <div className="App">
                <Container>
                    <Row>
                        <NavControl
                            renderNewLayer={actions.renderNewLayer}
                        />
                        {cartoWrapper}
                        {infoPanel}
                    </Row>
                </Container>
            </div>
        )
    }
}

// Map Redux state to component props
function mapStateToProps (state) {
    return {
        activeLayers: state.activeLayers,
        infoPanelHidden: state.infoPanelHidden,
        deleteLayer: state.deleteLayer,
        layerGUID: state.layerGUID,
    }
}

// Map Redux actions to component props
function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    }
}

SpongeWrapper.propTypes = {
    renderNewLayer: PropTypes.func.isRequired,
    togglePanel: PropTypes.func.isRequired,
    infoPanelHidden:  PropTypes.bool,
    activeLayers:  PropTypes.object,
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(SpongeWrapper)

export default App
