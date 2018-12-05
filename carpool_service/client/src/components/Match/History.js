import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { TextField, Button, Paper, Typography, Chip, Grid } from 'material-ui';
import moment from 'moment';

class History extends Component {
  componentDidMount() {
    this.props.fetchHistory();
  }

  renderHistory = () => {
    console.log('renderHistory, ride=', this.props.ride);
    if (!this.props || !this.props.ride || !this.props.ride.history) {
      return (
        <div style={{ marginTop: 10 }}>
          <Typography color="inherit" variant="subheading" align="center">
            There is no history
          </Typography>
        </div>
      );
    }

    return (
      <Grid container>
        {this.props.ride.history.map(ride => (
          <Grid item sm={6}>
            <Paper style={{ margin: 10, padding: 5 }}>
              <Typography align="center">
                Driver: <Chip label={ride.email} />
              </Typography>
              <Typography align="center">
                Start time: {moment(ride.journey_start_time).format('MM-DD LT')}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  render() {
    return this.renderHistory();
  }
}

export default connect(
  ({ post, ride }) => ({ post, ride }),
  actions
)(History);
