import React, { Component } from 'react';
import './stylesheet.scss'
import {Icon} from "semantic-ui-react";

class MenuItemPost extends Component {

    trimPercent = number => {
        let isPositive = number > 0;
        number = Math.abs(number);
        let whole = Math.floor(number);

        let percent = Math.round((number - whole) * 100);

        if (isNaN(whole) || isNaN(percent)) {
            return '0.00';
        }

        return whole + '.' + percent;
    };


    render() {
        const {title, description, compound, isPositive} = this.props;
        return (
            <div className="MenuItem-wolf">
                <h5>{title}</h5>
                <span
                    style={
                        !isPositive
                            ? {color: 'rgb(255,80,0)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                            : {color: 'rgb(0,200,5)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                    }
                    className="change">
                    {this.trimPercent(compound * 100)}%
                    <Icon
                        className="icon"
                        name={!isPositive ? 'arrow down' : 'arrow up'}

                    />
                    </span>

            </div>
        )
    }
}

export default MenuItemPost;

