import React, { Component } from 'react';
import './stylesheet.scss'
import MenuItem from "./MenuItem";
import { Header, Icon } from 'semantic-ui-react'
import Calendar from "../StockData/Calendar";
import moment from 'moment'
import data from '../../constants/result';
import MenuItemPost from "./MenuItemPost";


class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tickerData: [],
        }
    }
    componentDidMount() {
        const { tickers } = this.props;
        const { tickerData } = this.state;
        tickers.forEach(ticker => {
            let data = localStorage.getItem(`daily`);
            if (!data) {
                fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=GKZ3KECUBD35TO97`)
                    .then(res => res.json())
                    .then(data => {
                        let object = {
                            shortRatio: data['SharesShort'] / data['SharesFloat'],
                            price: data['200DayMovingAverage'],
                            retailControl: Math.abs(100 - data['PercentInstitutions'] - data['PercentInsiders']),
                            name: ticker,
                            companyName: data['Name']
                        };
                        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=GKZ3KECUBD35TO97`)
                            .then(res => res.json())
                            .then(data => {
                                if (data['Time Series (Daily)']) {
                                    let startDate = Object.keys(data['Time Series (Daily)'])[0];

                                    let open = data['Time Series (Daily)'][startDate]['1. open'];
                                    let close = data['Time Series (Daily)'][startDate]['4. close'];
                                    object.price = close;
                                    object.change = (close - open) / open;
                                }

                                tickerData.push(object);
                                if (tickerData.length === tickers.length) {
                                    localStorage.setItem(`daily`, JSON.stringify(tickerData));
                                    this.setState({tickerData});
                                }
                            });



                    });
            } else {
                this.setState({tickerData: JSON.parse(data)});
            }
        });


    }

    handleStockChange = (stockName) => {
        this.props.handleStockChange(stockName);
    };


    render() {
        const { tickerData } = this.state;
        const { tickers, currentStock, showReddit, selectedDate, isPositive } = this.props;
        tickerData.sort((a, b) => tickers.indexOf(a.name) - tickers.indexOf(b.name));

        let posts = data[currentStock];

        if (showReddit) {
            let date = new Date(selectedDate.getTime());
            let yesterday = date.setDate(date.getDate() - 1);
            date = new Date(selectedDate.getTime());
            let tomorrow = date.setDate(date.getDate() + 1);
            console.log(yesterday);
            console.log(tomorrow);
            posts = posts.filter(post => {
                let time = new Date(post.created * 1000);
                return time > yesterday && time < tomorrow;
            })
        }

        console.log(posts);

        return (
            <div className="Menu">
                {!showReddit ?
                    <Header style={{color: 'white'}} as='h3' icon>
                        Trending Stocks
                        <Icon name="line graph"/>
                    </Header>
                    :
                    <Header style={{color: 'white'}} as='h3' icon>
                        Trending Reddit Posts
                        <Header.Subheader style={{color: 'white'}}>
                            {moment(selectedDate).format('MMMM Do YYYY')}
                        </Header.Subheader>
                        <Icon name="comment"/>
                    </Header>
                }
                <br/>
                {!showReddit ?
                    tickerData.map(ticker =>
                    (<MenuItem
                        stockChange={this.handleStockChange}
                        isCurrentStock={ticker.name === currentStock}
                        ticker={ticker}
                    />))
                        :

                    posts.map(post => (
                        <MenuItemPost
                            title={post.title}
                            description={post.body}
                            compound={post.compound}
                            isPositive={isPositive}
                        />
                    ))
                    }
            </div>
        );
    }
}

export default Menu