import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Chip
} from 'material-ui';

// Need to be modified

class Ride extends Component {
  componentDidMount() {
    this.props.fetchRide();
  }

  renderRide = () => {
    console.log('renderRide, ride=', this.props.ride);
    if (!this.props || !this.props.ride || !this.props.ride.today) {
      return (
        <div style={{ marginTop: 10 }}>
          <Typography color="inherit" variant="subheading" align="center">
            There is no ride today
          </Typography>
        </div>
      );
    }

    return (
      <Paper style={{ marginTop: 10 }}>
        <Stepper>
          <Step>
            <StepLabel>{this.props.ride.today.source}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{this.props.ride.today.destination}</StepLabel>
          </Step>
        </Stepper>
        <Typography color="inherit" variant="subheading" align="center">
          Journey starts at: {this.props.ride.today.startTime}
        </Typography>
        <Typography align="center">
          Driver:
          <Chip style={{ margin: 5 }} label={this.props.ride.today.driver} />
          <br />
          Riders:{' '}
          {this.props.ride.today.riders.map(rider => (
            <Chip style={{ margin: 5 }} label={rider} key={rider} />
          ))}
        </Typography>
      </Paper>
    );
  };

  render() {
    return this.renderRide();
  }
}

export default connect(
  ({ ride }) => ({ ride }),
  actions
)(Ride);
