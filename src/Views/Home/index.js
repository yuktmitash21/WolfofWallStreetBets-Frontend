import React, { Component } from 'react';
import Menu from "../../Components/Menu";
import './stylesheet.scss'
import { Icon, Header} from 'semantic-ui-react';
import StockData from "../../Components/StockData";
import Calendar from "../../Components/StockData/Calendar";
import RedditData from "../../Components/RedditData";


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStock: 'GME',
            startDate: new Date(2021, 0, 7, 0, 0, 0, 0),
            endDate: new Date(2021, 1, 7, 0, 0, 0, 0),
        }
    }

    handleStockChange = (stock) => this.setState({currentStock: stock});
    handleDateChange = (startDate, endDate) => { this.setState({startDate, endDate})};

    render() {

        const { currentStock, startDate, endDate } = this.state;

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
                    handleStockChange={this.handleStockChange}
                    currentStock={currentStock}
                    tickers={tickers}
                />
                <br/>


                <StockData
                    startDate={startDate}
                    endDate={endDate}
                    currentStock={currentStock}
                    changeDate={this.handleDateChange}
                />

                <br/>
                <br/>

                <RedditData
                    startDate={startDate}
                    endDate={endDate}
                    currentStock={currentStock}
                />


                <br/>
                <br/>
                <br/>
            </div>
        );
    }

}

export default Home