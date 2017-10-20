import React, { Component } from 'react'
import { Container, Row } from 'reactstrap'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './App.css'

import InfoPanel from './components/InfoPanel'
import NavControl from './components/NavControl'
import CartoWrapper from './components/CartoWrapper'
import { togglePanel } from './actions'

class SpongeWrapper extends Component {
    render () {
        const {
            onTogglePanel,
            infoPanelHidden
        } = this.props

        const infoPanel = infoPanelHidden ? ''
            : <InfoPanel
                togglePanel={onTogglePanel}
                hidden={infoPanelHidden}
            />

        return (

            <div className="App">
                <Container>
                    <Row>
                        <NavControl/>
                        <CartoWrapper
                            width={infoPanelHidden ? '600px' : '500px'}
                            height={infoPanelHidden ? '600px' : '500px'}
                        />
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
        infoPanelHidden: state.infoPanelHidden
    }
}

// Map Redux actions to component props
function mapDispatchToProps (dispatch) {
    return {
        onTogglePanel: () => dispatch(togglePanel)
    }
}

SpongeWrapper.propTypes = {
    onTogglePanel: PropTypes.func.isRequired,
    infoPanelHidden:  PropTypes.bool
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(SpongeWrapper)

export default App
