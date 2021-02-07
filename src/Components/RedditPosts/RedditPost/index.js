import React, { Component } from 'react';
import './stylesheet.scss'
import {Icon} from "semantic-ui-react";

class RedditPost extends Component {

    trimPercent = number => {
        number = Math.abs(number);
        let whole = Math.floor(number);

        let percent = Math.round((number - whole) * 100);

        if (isNaN(whole) || isNaN(percent)) {
            return '0.00';
        }

        return whole + '.' + percent;
    };

    render() {
        const {title, description, change} = this.props;
        return (
            <div style={{color: 'white', marginBottom: '3rem'}}>
                <h3>{title}</h3>
                <span
                    style={
                        change < 0
                            ? { color: 'rgb(255,80,0)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                            : { color: 'rgb(0,200,5)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                    }
                    className="change">
                    {this.trimPercent(change * 100)}%
                    <Icon
                        className="icon"
                        name={change < 0 ? 'arrow down' : 'arrow up'}

                    />
                    </span>

                {/*<p>{description}</p>*/}

            </div>
        );
    }
}

export default RedditPost