import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { Doughnut } from 'react-chartjs-2';
import { Typography, Grid } from 'material-ui';

class Statistic extends Component {
  componentDidMount() {
    this.props.fetchAnalytics();
  }

  render() {
    console.log('Statistics, match/unmatch', this.props.analytics);
    if (!this.props.analytics) return <Fragment />;
    return (
      <div style={{ marginTop: 20 }}>
        <Grid container style={{ marginTop: 20 }}>
          <Grid item sm={3} />
          <Grid item sm={6}>
            <Typography variant="display1" align="center">
              The Match today
            </Typography>
            <Doughnut
              data={{
                labels: ['Matched Riders', 'Unmatched Riders'],
                datasets: [
                  {
                    data: [
                      this.props.analytics.matched,
                      this.props.analytics.unmatched
                    ],
                    backgroundColor: [
                      'rgba(255, 0, 0, 0.5)',
                      'rgba(0, 255, 0, 0.5)'
                    ]
                  }
                ]
              }}
            />
          </Grid>
          <Grid item sm={3} />
        </Grid>
      </div>
    );
  }
}

export default connect(
  ({ analytics }) => ({ analytics }),
  actions
)(Statistic);
