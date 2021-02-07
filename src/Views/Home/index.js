import React, { Component } from 'react';
import Menu from "../../Components/Menu";
import './stylesheet.scss'
import { Icon, Header, Divider} from 'semantic-ui-react';
import StockData from "../../Components/StockData";
import Calendar from "../../Components/StockData/Calendar";
import RedditData from "../../Components/RedditData";
import RedditPosts from "../../Components/RedditPosts";


class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStock: 'GME',
            startDate: new Date(2021, 0, 7, 0, 0, 0, 0),
            endDate: new Date(2021, 1, 7, 0, 0, 0, 0),
            showReddit: false,
            selectedDate: null,
            isPositive: false,
        }
    }

    handleStockChange = (stock) => this.setState({currentStock: stock});
    handleDateChange = (startDate, endDate) => { this.setState({startDate, endDate})};

    showRedditFunc = (show, date, isPositive) => this.setState({showReddit: show, selectedDate: date, isPositive});

    render() {

        const { currentStock, startDate, endDate, showReddit, selectedDate, isPositive } = this.state;

        console.log(selectedDate);

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
                    showReddit={showReddit}
                    selectedDate={selectedDate}
                    isPositive={isPositive}
                />
                <br/>

                <StockData
                    startDate={startDate}
                    endDate={endDate}
                    currentStock={currentStock}
                    changeDate={this.handleDateChange}
                    showReddit={this.showRedditFunc}
                />

                <RedditPosts
                    startDate={startDate}
                    endDate={endDate}
                    currentStock={currentStock}
                />
            </div>
        );
    }

}

export default Home