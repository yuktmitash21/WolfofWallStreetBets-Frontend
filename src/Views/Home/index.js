import React, { Component } from 'react';
import Menu from "../../Components/Menu";
import './stylesheet.scss'
import { Icon, Header} from 'semantic-ui-react';


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStock: 'GME'
        }
    }

    handleStockChange = (stock) => this.setState({currentStock: stock});

    render() {

        const { currentStock } = this.state;

        const tickers = ["GME", "SPY", "AMC", "BB", "TSLA", "CRSR", "NOK", "AAPL", "SNAP"];

        return (
            <div className="home">
                <Header className='homepage-title' as='h3' icon>
                    <Icon style={{marginBottom: '2rem', color: 'firebrick'}} name="rocket"/>
                    <span className="Main-header">The Wolf of WallStreetBets</span>
                    <Header.Subheader className="subheader-1">
                        "Analytics For The People<br/> By The People"
                    </Header.Subheader>
                </Header>
                <Menu
                    currentStock={currentStock}
                    tickers={tickers}
                />
            </div>
        );
    }

}

export default Home