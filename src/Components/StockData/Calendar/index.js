import React, { Component } from 'react';
import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './stylesheet.scss'

class Calendar extends Component {

    constructor(props) {
        super(props);
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
        const {startDate, endDate} = this.props;

        return (
            <div className="Calendar">
                <div style={{float: 'left'}}>
                    <h3 className="header">Start</h3>
                    <DatePicker selected={startDate} onChange={date => this.props.handleDateChange(date, endDate)}/>
                </div>
                <div>
                    <h3 className="header">End</h3>
                    <DatePicker selected={endDate} onChange={date => this.props.handleDateChange(startDate, date)} />
                </div>
            </div>

        );
    }

}

export default Calendar


