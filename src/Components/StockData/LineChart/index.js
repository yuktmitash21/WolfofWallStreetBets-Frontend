import React, { Component } from 'react';
import './stylesheet.scss'
import {Line} from 'react-chartjs-2';


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

    fetchData = () => {
        const { ticker } = this.props;
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=60min&outputsize=full&apikey=GKZ3KECUBD35TO97`)
            .then(res => res.json())
            .then(data => {
                this.setState({graphData: data['Time Series (60min)']});
            })
    };

    render() {
        const {startDate, endDate, positive, ticker, companyName} = this.props;
        const { graphData } = this.state;

        if (!graphData) {
            return null;
        }

        let dates = Object.keys(graphData);

        let lineColor = positive ? 'rgb(0,200,5)' : 'rgb(255,80,0)';

        dates = dates.filter(a => {
            let curr = new Date(a);

            if (curr >= startDate && curr <= endDate) {
                return true;
            } else {
                //console.log(curr);
                return false;
            }
        });

        dates.sort((a, b) =>  new Date(a) - new Date(b));

        //dates = dates.filter((date, index) =>  index % 10 === 0);


        let data = dates.map(a => graphData[a]['2. high']);

        console.log(data.length);



        const dataLine = {
            labels: dates,
            datasets: [
                {
                    label: `${companyName} (${ticker})`,
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
                    data: data
                }
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
                    price = data[index];
                    let previousPrice = index === 0 ? 1 : data[index - 1];

                    percentChange = (price - previousPrice)/ previousPrice;
                }

                props.updateUi(price, percentChange);
            }
        };


        return (
            <div className="LineChart">
                <Line data={dataLine}
                      options={chartOptions}
                      ref={reference => lineChartInst = reference}
                />
            </div>
        )
    };


}

export default LineChart;