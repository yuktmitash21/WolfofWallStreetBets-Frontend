import React, { Component } from 'react';
import './stylesheet.scss'
import moment from 'moment';

import data from '../../constants/result'
import {Line} from "react-chartjs-2";
import {Header, Icon} from "semantic-ui-react";

const PARTITIONS = 100;

class RedditData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            percentChangeBullScore: null,
            bullScoreGraph: null,
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

    removeOutliers = (labels, bullScores) => {
        var values = bullScores.concat();

        // Then sort
        values.sort( function(a, b) {
            return a - b;
        });

        /* Then find a generous IQR. This is generous because if (values.length / 4)
         * is not an int, then really you should average the two elements on either
         * side to find q1.
         */
        var q1 = values[Math.floor((values.length / 4))];
        // Likewise for q3.
        var q3 = values[Math.ceil((values.length * (3 / 4)))];
        var iqr = q3 - q1;

        // Then find min and max values
        var maxValue = q3 + iqr*1.5;
        var minValue = q1 + iqr*1.5;

        let indicesToRemove = [];

        for (let i = 0; i < bullScores.length; i++) {
            if (bullScores[i] <= minValue || bullScores[i] >= maxValue) {
                bullScores[i] /= 1000;
                indicesToRemove.push(i);
            }
        }

        const labelsUpdate = labels.filter((label, index) => !indicesToRemove.includes(index));
        const bullsUpdate = bullScores.filter((bull, index) => !indicesToRemove.includes(index));

        return { labelsUpdate: labels, bullsUpdate: bullScores};

    };

    render() {
        console.log(data);
        const { startDate, endDate, currentStock} = this.props;
        const { percentChangeBullScore, bullScoreGraph } = this.state;

        let arr = data[currentStock];

        let startTime = startDate.getTime();
        let endTime = endDate.getTime();
        let increment = (endTime - startTime) / PARTITIONS;

        let dataOfCompanies = JSON.parse(localStorage.getItem(`daily`));
        let { companyName } = dataOfCompanies.find(d => d.name === currentStock);

        let labels = [];
        let bullScores = [];

        let totalBullScore = 0;

        for (let i = startTime; i < endTime; i += increment) {
            let bullScore = 0;
            let dataPoints = arr.filter(a => (a.created * 1000) > i && (a.created * 1000) < (i + increment));
            dataPoints.forEach(post => {
                bullScore += (post.num_comments * post.compound);
            });

            labels.push(moment(new Date(i)).format('MMMM Do YYYY'));
            bullScores.push(bullScore);
            totalBullScore += bullScore;
        }

       const {labelsUpdate, bullsUpdate} = this.removeOutliers(labels, bullScores);

        labels = labelsUpdate;
        bullScores = bullsUpdate;



        totalBullScore = bullScoreGraph || (totalBullScore /bullScores.length);

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


        let priceColor = totalBullScore < 0 ? 'rgb(255,80,0)' : 'rgb(0,200,5)';

        return (
            <div className="LineChart">

                <Header as='h1' className="header" style={
                    !percentChangeBullScore ? {width: 'auto', color: 'white'}
                        : percentChangeBullScore < 0 ?{width: 'auto', color: 'rgb(255,80,0)'} : {width: 'auto', color: 'rgb(0,200,5)' }
                }>
                    {companyName ? `${companyName} (${currentStock})` : currentStock}

                    <Header.Subheader style={{color: priceColor, marginTop: '1rem', fontSize: '30px'}}>
                        {this.trimPercent(totalBullScore)}
                        {percentChangeBullScore &&
                        <span
                            style={
                                percentChangeBullScore < 0
                                    ? {color: 'rgb(255,80,0)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                                    : {color: 'rgb(0,200,5)', marginTop: '2rem', marginLeft: '5px', fontSize: '15px'}
                            }
                            className="change">
                    {this.trimPercent(percentChangeBullScore)}%
                    <Icon
                        className="icon"
                        name={percentChangeBullScore < 0 ? 'arrow down' : 'arrow up'}

                    />
                    </span>
                        }
                    </Header.Subheader>
                </Header>


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