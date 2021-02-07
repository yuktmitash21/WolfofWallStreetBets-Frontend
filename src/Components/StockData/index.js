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

    updateUIPrice = (stockPriceGraph, percentChangeGraph) => {
        this.setState({stockPriceGraph, percentChangeGraph});
    };

    handleDateChange = (startDate, endDate) => {
        this.props.changeDate(startDate, endDate);
    };

    render() {
        const { percentChangeGraph, stockPriceGraph} = this.state;
        const {startDate, endDate} = this.props;

        let data = localStorage.getItem(`daily`);

        const { currentStock } = this.props;
        if (!data) {
            return null;
        }
        data = JSON.parse(data);


        let { companyName, name, change, price } = data.find(d => d.name === currentStock);

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
                <Header as='h1' className="header" style={
                    !percentChangeGraph ? {width: 'auto', color: 'white'}
                    : percentChangeGraph < 0 ?{width: 'auto', color: 'rgb(255,80,0)'} : {width: 'auto', color: 'rgb(0,200,5)' }
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

                <Calendar
                    startDate={startDate}
                    endDate={endDate}
                    handleDateChange={this.handleDateChange}
                />

                <br/>
                <br/>
                <br/>
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