import React, { Component } from 'react';
import './stylesheet.scss'
import { Divider } from 'semantic-ui-react'
import {Icon, Header } from 'semantic-ui-react';
import Calendar from "./Calendar";
import LineChart from "./LineChart";

class StockData extends Component {

    constructor(props) {
        super(props);
        this.state = {

            percentChangeGraph: null,
            stockPriceGraph: null,
            gmeData: null,
        }
    }

    componentDidMount() {

        if (!localStorage.getItem(`daily`)) {
            fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=GME&apikey=GKZ3KECUBD35TO97`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    let object = {
                        shortRatio: data['SharesShort'] / data['SharesFloat'],
                        price: data['200DayMovingAverage'],
                        retailControl: Math.abs(100 - data['PercentInstitutions'] - data['PercentInsiders']),
                        name: 'GME',
                        companyName: data['Name']
                    };

                    this.setState({gmeData: object});
                });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (!localStorage.getItem(`daily`)) {
            fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=GME&apikey=GKZ3KECUBD35TO97`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    let object = {
                        shortRatio: data['SharesShort'] / data['SharesFloat'],
                        price: data['200DayMovingAverage'],
                        retailControl: Math.abs(100 - data['PercentInstitutions'] - data['PercentInsiders']),
                        name: 'GME',
                        companyName: data['Name']
                    };

                    this.setState({gmeData: object});
                });
        }
    }


    trimPercent = number => {
        number = Math.abs(number);
        let whole = Math.floor(number);

        let percent = Math.round((number - whole) * 100);

        if (isNaN(whole) || isNaN(percent)) {
            return '0.00';
        }

        return whole + '.' + percent;
    };

    updateUIPrice = (stockPriceGraph, percentChangeGraph, date) => {
        this.setState({stockPriceGraph, percentChangeGraph});
        this.props.showReddit(stockPriceGraph !== null, date, percentChangeGraph > 0)
    };

    handleDateChange = (startDate, endDate) => {
        this.props.changeDate(startDate, endDate);
    };

    render() {
        let { percentChangeGraph, stockPriceGraph, gmeData} = this.state;
        const {startDate, endDate} = this.props;

        let data = localStorage.getItem(`daily`);

        const { currentStock } = this.props;
        if (!data) {
            if (!gmeData) {
                return null;
            }
        } else {
            data = JSON.parse(data);
            gmeData = data.find(d => d.name === currentStock);
        }

        let companyName = gmeData.companyName;
        let name = gmeData.name;
        let change = gmeData.change;
        let price = gmeData.price;


        change = percentChangeGraph || change;
        price = stockPriceGraph || price;

        let percentString = (Math.abs(change) * 100);
        let compressedPercentString = (percentString + '').substring(0, 4);

        let priceColor =
        !percentChangeGraph ? 'white'
            : percentChangeGraph < 0 ? 'rgb(255,80,0)' : 'rgb(0,200,5)';


        return (
            <div className="StockData">
                <Divider />

                <Calendar
                    startDate={startDate}
                    endDate={endDate}
                    handleDateChange={this.handleDateChange}
                />

                <br/>
                <br/>
                <br/>

                <Header as='h1' className="header" style={
                    !percentChangeGraph ? {width: 'auto', color: 'white', marginTop: '5rem'}
                        : percentChangeGraph < 0 ?{width: 'auto', color: 'rgb(255,80,0)', marginTop: '5rem'} : {width: 'auto', color: 'rgb(0,200,5)', marginTop: '5rem' }
                }>
                    {companyName ? `${companyName} (${name})` : name}

                    <Header.Subheader style={{color: priceColor, marginTop: '1rem', fontSize: '30px'}}>
                        ${this.trimPercent(price)}
                        <span
                            style={
                                change < 0
                                    ? { color: 'rgb(255,80,0)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                                    : { color: 'rgb(0,200,5)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                            }
                            className="change">
                    {compressedPercentString}%
                    <Icon
                        className="icon"
                        name={change < 0 ? 'arrow down' : 'arrow up'}

                    />
                    </span>
                    </Header.Subheader>
                </Header>

                <LineChart
                    positive={change >= 0}
                    startDate={startDate}
                    endDate={endDate}
                    ticker={name}
                    companyName={companyName}
                    updateUi={this.updateUIPrice}
                />




            </div>
        )

    }
}

export default StockData;