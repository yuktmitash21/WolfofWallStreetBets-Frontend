import React, { Component } from 'react';
import './stylesheet.scss'
import data from '../../constants/result'
import RedditPost from "./RedditPost";

import { Header, Icon, Divider } from 'semantic-ui-react'

class RedditPosts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateWidth);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWidth);
    }

    updateWidth = () => {
        this.setState({width: window.innerWidth});
    };


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

        const { currentStock, startDate, endDate } = this.props;
        const { width } = this.state;

        let posts = data[currentStock];

        posts = posts.filter(post => {
            let created = post.created * 1000;
            return created >= startDate.getTime() && created <= endDate.getTime();
        });

        let bulls = posts.filter(post => post.compound > 0);
        let bears = posts.filter(post => post.compound < 0);

        bulls.sort((a, b) => b.body.length - a.body.length);
        bears.sort((a, b) => b.body.length - a.body.length);

        let averagePositive = 0;
        let averageNegative = 0;

        bulls.forEach(bull => {
            averagePositive += bull.compound;
        });

        bears.forEach(bear => {
            averageNegative += bear.compound;
        });

        averagePositive /= bulls.length;
        averageNegative /= bears.length;

        return (
            <div style={width < 1000 ? {padding: '0'} : {}} className="RedditPosts">
                <h1 style={{color: 'white', fontSize: '50px'}}>Reddit Analysts</h1>
                <div style={{color: 'white', float: 'left', width: '43%'}}>
                    <h1 style={{color: 'white', display: 'inline', fontSize: '40px'}} icon as='h1'>
                        Bulls
                    </h1>

                    <span
                        style={
                            averagePositive < 0
                                ? { color: 'rgb(255,80,0)', marginTop: '2rem', marginLeft: '20px', fontSize: '12px'}
                                : { color: 'rgb(0,200,5)', marginTop: '2rem', marginLeft: '20px', fontSize: '12px'}
                        }
                        className="change">
                    {this.trimPercent(averagePositive * 100)}%
                    <Icon
                        className="icon"
                        name={averagePositive < 0 ? 'arrow down' : 'arrow up'}

                    />
                    </span>


                    <Divider/>
                    {bulls.map(bull => (
                        <RedditPost
                            title={bull.title}
                            description={bull.body}
                            change={bull.compound}
                        />
                    ))}

                </div>
                <div style={{color: 'white', float: 'right', width: '43%'}}>
                    <h1 style={{color: 'white', display: 'inline', fontSize: '40px'}} icon as='h1'>
                        Bears
                    </h1>

                    <span
                        style={
                            averageNegative < 0
                                ? { color: 'rgb(255,80,0)', marginTop: '2rem', marginLeft: '20px', fontSize: '12px'}
                                : { color: 'rgb(0,200,5)', marginTop: '2rem', marginLeft: '20px', fontSize: '12px'}
                        }
                        className="change">
                    {this.trimPercent(averageNegative * 100)}%
                    <Icon
                        className="icon"
                        name={averageNegative < 0 ? 'arrow down' : 'arrow up'}

                    />
                    </span>

                    <Divider/>
                    {bears.map(bear => (
                        <RedditPost
                            title={bear.title}
                            description={bear.body}
                            change={bear.compound}
                        />
                    ))}

                </div>
            </div>
        )
    }
}

export default RedditPosts