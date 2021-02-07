import React, { Component } from 'react';
import './stylesheet.scss'


import data from '../../constants/result'
import {Line} from "react-chartjs-2";

const PARTITIONS = 100;

class RedditData extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log(data);
        const { startDate, endDate, currentStock} = this.props;

        let arr = data[currentStock];

        let startTime = startDate.getTime();
        let endTime = endDate.getTime();
        let increment = (endTime - startTime) / PARTITIONS;

        let dataOfCompanies = JSON.parse(localStorage.getItem(`daily`));
        let { companyName } = dataOfCompanies.find(d => d.name === currentStock);

        let labels = [];
        let bullScores = [];

        for (let i = startTime; i < endTime; i += increment) {
            let bullScore = 0;
            let dataPoints = arr.filter(a => (a.created * 1000) > i && (a.created * 1000) < (i + increment));
            dataPoints.forEach(post => {
               bullScore += (post.num_comments * post.compound);
            });
            labels.push(startTime);
            bullScores.push(bullScore);
        }

        const dataLine = {
            labels: labels,
            datasets: [
                {
                    label: `${companyName} (${currentStock}) Bullishness`,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'black',
                    borderColor: 'green',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: bullScores
                }
            ]

        };




        return (
            <div className="LineChart">
                <h3 style={{color: 'white'}}>Wolf Score</h3>
                <Line data={dataLine}
                      // options={chartOptions}
                      // ref={reference => lineChartInst = reference}
                />
            </div>
        );
    }

}

export default RedditData;