import React, { Component } from 'react'

import { Button } from 'reactstrap'

class InfoPanel extends Component {
    render () {
        const hideButton = <Button
            onClick={ this.props.togglePanel }>
            {this.props.hidden ? 'show' : 'hide'}
        </Button>

        const pageContent = this.props.hidden ? hideButton
            : <div className="sidepanel">
                {hideButton}
                <div className="wrapper">
                    <div className="context subheader">
                        <p>A joint UNHCR/UNICEF innovation project</p>
                    </div>
                    <h1 className="text-muted">SpongeBase visualization</h1>
                    <p>  The number of Syrians registered as refugees in
                       + Lebanon after fleeing war in their country has
                       + surpassed one million. Refugees from Syria, now
                       + equal a quarter of Lebanon''s resident population.
                       + Most of them live in poverty and depend on aid for
                       + survival.
                    </p>

                    <h4 className="text-muted">DESCRIPTION</h4>
                    <p>This interactive map collates available information from different data sources and links them to a location whether a governorate,a district, a village or even a small camp.</p>
                    <h4 className="text-muted">SOURCES</h4>
                    <p>
                        <a href="http://data.unhcr.org/syrianrefugees/country.php?id=122">UNHCR Data Portal</a>
                        <a href="http://activityinfo.org">Activity Info</a>
                    </p>
                </div>
                <div id="page-wrap" className="wrapper">
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#ai_data" data-toggle="tab">Humanitarian Data</a></li>
                        <li><a href="#social" data-toggle="tab">Social</a></li>
                    </ul>
                    <div className="tab-content">
                        <div id="ai_data" className="tab-pane active"></div>
                        <div id="social" className="tab-pane">
                            <div id="twitter-feed"></div>
                        </div>
                    </div>
                </div>
                <div className="context footer">
                    <p>Visit the Inter-agency information sharing webportal <a href="http://data.unhcr.org/syrianrefugees/country.php?id=122">Here</a></p>
                </div>
            </div>

        return pageContent
    }
}

export default InfoPanel
