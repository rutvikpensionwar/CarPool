import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Typography, Button, TextField } from 'material-ui';
import { connect } from 'react-redux';
import * as actions from '../actions';

export default connect(
  null,
  actions
)(
  class extends Component {
    state = {
      email: '',
      password: ''
    };

    handleSignUp = event => {
      console.log('sign-up', this.state.email, this.state.password);
      this.props.signUp(this.state.email, this.state.password);
    };

    handleChange = (event, field) => {
      if (field === 'email') {
        this.setState({ email: event.target.value });
      } else if (field === 'password') {
        this.setState({ password: event.target.value });
      }
    };

    render() {
      return (
        <div style={{ marginTop: 50 }}>
          <Typography variant="display1" align="center">
            <b>Not a user yet?</b>
          </Typography>
          <Typography variant="display2" align="center">
            <b>Sign up right now to make a Match</b>
            <br />
            <TextField
              ref="email"
              style={{ width: 300 }}
              label="Email"
              placeholder="example@carpool.com"
              margin="normal"
              onChange={event => this.handleChange(event, 'email')}
            />
            <br />
            <TextField
              ref="password"
              style={{ width: 300 }}
              label="Password"
              type="password"
              margin="normal"
              onChange={event => this.handleChange(event, 'password')}
            />
            <br />
            <Button
              style={{ width: 300 }}
              variant="raised"
              color="primary"
              onClick={this.handleSignUp}
            >
              Sign Up
            </Button>
          </Typography>
        </div>
      );
    }
  }
);
