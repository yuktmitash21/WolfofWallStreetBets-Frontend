import React, { Component } from 'react';
import './stylesheet.scss'
import { Divider } from 'semantic-ui-react'
import {Icon, Header } from 'semantic-ui-react';
import Calendar from "./Calendar";

class StockData extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    trimPercent = number => {
        number = Math.abs(number);
        let whole = Math.floor(number);

        let percent = Math.round((number - whole) * 100);

        if (!whole || !percent) {
            return '0.00%';
        }

        return whole + '.' + percent;
    };

    render() {
        let data = localStorage.getItem(`daily`);

        const { currentStock } = this.props;
        if (!data) {
            return null;
        }
        data = JSON.parse(data);


        let { companyName, name, change, price,} = data.find(d => d.name === currentStock);

        let percentString = (Math.abs(change) * 100);
        let compressedPercentString = (percentString + '').substring(0, 4);

        return (
            <div className="StockData">
                <Divider />
                <Header as='h1' className="header" style={{width: 'auto', color: 'white'}}>
                    {companyName ? `${companyName} (${name})` : name}

                    <Header.Subheader style={{color: 'white', marginTop: '1rem', fontSize: '30px'}}>
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
                
                <Calendar/>


            </div>
        )

    }
}

export default StockData;