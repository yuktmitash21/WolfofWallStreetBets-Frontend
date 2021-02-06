import React, { Component } from 'react';
import './stylesheet.scss'
import MenuItem from "./MenuItem";
import { Header, Icon } from 'semantic-ui-react'


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
            data = null;
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


    render() {
        const { tickerData } = this.state;
        const { tickers, currentStock } = this.props;
        tickerData.sort((a, b) => tickers.indexOf(a.name) - tickers.indexOf(b.name));
        console.log(tickerData);

        return (
            <div className="Menu">
                <Header style={{color: 'white'}} as='h3' icon>
                    Trending Stocks
                    <Icon name="line graph"/>
                </Header>
                <br/>
                {tickerData.map(ticker =>
                    (<MenuItem
                        isCurrentStock={ticker.name === currentStock}
                        ticker={ticker}
                    />)
                )}
            </div>
        );
    }
}

export default Menu