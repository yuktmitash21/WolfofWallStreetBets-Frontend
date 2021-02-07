import React, { Component } from 'react';
import './stylesheet.scss'
import {Line} from 'react-chartjs-2';
import moment from 'moment'

import data from '../../../constants/result'

const PARTITIONS = 100;

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            graphData: null
        }

    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.ticker && prevProps.ticker !== this.props.ticker) {
            this.fetchData();
        }

    }

    trimPercent = number => {
        let isPositive = number > 0;
        number = Math.abs(number);
        let whole = Math.floor(number);

        let percent = Math.round((number - whole) * 100);

        if (isNaN(whole) || isNaN(percent)) {
            return '0.00';
        }

        return (isPositive ? '' : '-') + whole + '.' + percent;
    };

    fetchData = () => {
        const { ticker } = this.props;
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=full&apikey=GKZ3KECUBD35TO97`)
            .then(res => res.json())
            .then(data => {
                this.setState({graphData: data['Time Series (60min)']});
            })
    };

    getAverageBull = () => {
        const { ticker, startDate, endDate } = this.props;

        let arr = data[ticker];
        let dataPoints = arr.filter(a => {
            let time = a.created * 1000;
            return time >= startDate.getTime() && time <= endDate.getTime();
        });

        let average = 0;

        dataPoints.forEach(point => {
           average += point.compound;
        });

        return average / dataPoints.length;

    };

    getBullScores = (labels, prices) => {
        const { ticker } = this.props;
        let bullScores = [];

        let arr = data[ticker];

        let average = 0;

        for (let i = 0; i < prices.length; i++) {
            average += prices[i];
        }

        average /= prices.length;



        labels.forEach((label, index) => {
            let dataPoints = arr.filter(a => {
                if (index < labels.length - 1) {
                    return (a.created * 1000) > label && (a.created * 1000) < (labels[index + 1])
                } else {
                    return (a.created * 1000) > label;
                }
            });


            let bullScore = 0;

            dataPoints.forEach(post => {
                bullScore += (post.compound);
            });

            bullScore /= dataPoints.length;

            bullScore = (bullScore *  average) || 0;





            bullScores.push(bullScore);

        });

        console.log(bullScores);

        return bullScores;

    };

    render() {
        const {startDate, endDate, positive, ticker, companyName} = this.props;
        const { graphData } = this.state;

        if (!graphData) {
            return null;
        }

        let dates = Object.keys(graphData);

        let lineColor = positive ? 'rgb(0,200,5)' : 'rgb(255,80,0)';

        let startTime = startDate.getTime();
        let endTime = endDate.getTime();

        let increment = (endTime - startTime) / PARTITIONS;

        let labels = [];
        let prices = [];

        for (let i = startTime; i < endTime; i += increment) {
            let price = 0;

            let tempDates = dates.filter(a => {
                let curr = new Date(a);

                return curr <= new Date(i + increment) && curr >= new Date(i)
            });

            tempDates.forEach(date => {
                price += Number.parseInt(graphData[date]['2. high'])
            });




            if (tempDates.length > 0) {
                price /= tempDates.length;
                labels.push(new Date(i));
                prices.push(price);
            }

        }

        let bullScores = this.getBullScores(labels, prices);
        let averageBull = this.getAverageBull();

        console.log('average bull');
        console.log(averageBull);


        const dataLine = {
            labels: labels.map(a => moment(new Date(a)).format('MMMM Do YYYY')),
            datasets: [
                {
                    label: `${companyName || ''} (${ticker}) Price`,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'black',
                    borderColor: lineColor,
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
                    data: prices
                },

                {
                    label: `${companyName || ''} (${ticker}) Bullishness`,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'black',
                    borderColor: 'orange',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'orange',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'orange',
                    pointHoverBorderColor: 'orange',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: bullScores
                },

                {
                    label: `Zero`,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'white',
                    borderColor: 'white',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'white',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'white',
                    pointHoverBorderColor: 'white',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: bullScores.map(a => 0)
                },
            ]

        };

        let lineChartInst = null;
        let props = this.props;

        const chartOptions = {
            onHover: e => {
                if (!lineChartInst) {
                    return;
                }
                const item = lineChartInst.chartInstance.getElementAtEvent(e);

                let price = null;
                let percentChange = null;

                if (item.length !== 0) {
                    let index = item[0]._index;
                    price = prices[index];
                    let previousPrice = index === 0 ? 1 : prices[index - 1];

                    percentChange = (price - previousPrice)/ previousPrice;
                }

                props.updateUi(price, percentChange);
            },

            legend: {
                labels: {
                    filter: function(item, chart) {
                        // Logic to remove a particular legend item goes here
                        return !item.text.includes('Zero');
                    }
                }
            }
        };


        return (
            <div className="LineChart">
                <h3 style={{fontSize: '20px', color: 'white', margin: 0}}> Bull Score
                    <span style={averageBull <= 0 ? {fontSize: '20px', marginLeft: '5px', color: 'rgb(255,80,0)'} : {fontSize: '20px', marginLeft: '5px', color: 'rgb(0,200,5)'}}>
                        {this.trimPercent(averageBull * 100)}%
                    </span>
                </h3>
                <br/>
                <Line data={dataLine}
                      options={chartOptions}
                      ref={reference => lineChartInst = reference}
                />
            </div>
        )
    };


}

export default LineChart;