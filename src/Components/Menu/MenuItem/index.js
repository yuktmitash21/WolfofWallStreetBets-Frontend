import React, { Component } from 'react';
import './stylesheet.scss'
import {Icon, Popup } from 'semantic-ui-react';

class MenuItem extends Component {
    render() {
        const { ticker, isCurrentStock } = this.props;

        let percentChange = ticker.change;
        let percentString = (Math.abs(percentChange) * 100);
        let compressedPercentString = (percentString + '').substring(0, 4);


        console.log(isCurrentStock);
        return (
            <div style={isCurrentStock ? {backgroundColor: 'rgba(0,0,0,0.6)'} : {}} className="MenuItem-wolf">
                <h3 className="header">{ticker.name}</h3>
                <h5 style={{float:'right', display: 'inline', margin: '0'}}>
                    ${Math.floor(ticker.price) + "." + Math.round((ticker.price - Math.floor(ticker.price)) * 100)}
                    <br/>
                    <span
                        style={
                            percentChange < 0
                                ? { color: 'rgb(255,80,0)' }
                                : { color: 'rgb(0,200,5)' }
                        }
                        className="change">
				{compressedPercentString} %
				<Icon
                    className="icon"
                    name={percentChange < 0 ? 'arrow down' : 'arrow up'}

                />
			</span>
                </h5>
                <br/>
                <br/>

                <span className="pop-wrapper">
                    <Popup
                        inverted
                        position='left center'
                        content={'An estimation of the percent of the float owned by retail investors. A higher percent means WSB has more control'}
                        trigger={
                            <Icon
                                className="info-pop"
                                name="question circle"
                            />
                        }
                    />
                    <span className="text">Retail Control: {this.trimPercent(ticker.retailControl)}%</span>
                    </span>
                <br/>
                <br/>
                <span className="pop-wrapper">

                    <Popup
                        inverted
                        position='left center'
                        content={'An estimation of the percent of the company currently shorted'}
                        trigger={
                            <Icon
                                className="info-pop"
                                name="question circle"
                            />
                        }
                    />

                    <span className="text">Short Squeeze Danger {this.trimPercent(ticker.shortRatio * 100)}%</span>
                </span>
                <br/>
            </div>
        )
    }

    trimPercent = number => {
        number = Math.abs(number);
        let whole = Math.floor(number);

        let percent = Math.round((number - whole) * 100);

        return whole + '.' + percent;
    }
}

export default MenuItem;