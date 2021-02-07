import React, { Component } from 'react';
import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './stylesheet.scss'

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(2021, 1, 7),
            endDate: new Date(2021, 1, 8),
        }
    }



    getMonthAgo = () => {
        let d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d;
    };

    getOneWeekAgo = () => {
        let d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
    };

    render() {
        const {startDate, endDate} = this.state;
        console.log(startDate);

        return (
            <div className="Calendar">
                <div style={{float: 'left'}}>
                    <h3 className="header">Start</h3>
                    <DatePicker selected={startDate} onChange={date => this.setState({startDate: date})} />
                </div>
                <div>
                    <h3 className="header">End</h3>
                    <DatePicker selected={endDate} onChange={date => this.setState({endDate: date})} />
                </div>
            </div>

        );
    }

}

export default Calendar


