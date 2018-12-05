import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Input,
  Typography
} from 'material-ui';

const mapPropsToState = ({ auth, dialog }) => ({
  auth,
  open: dialog.signInOpen,
  signInFail: dialog.signInFail
});

export default connect(
  mapPropsToState,
  actions
)(
  class extends Component {
    state = {
      email: '',
      password: ''
    };

    handleSignIn = event => {
      const signIn = async () => {
        await this.props.signIn(this.state.email, this.state.password);
        if (this.props.auth) this.setState({ email: '', password: '' });
      };
      signIn();
    };

    handleChange = (event, field) => {
      if (field === 'email') {
        this.setState({ email: event.target.value });
      } else if (field === 'password') {
        this.setState({ password: event.target.value });
      }
    };

    handleKeyDown = event => {
      if (event.key === 'Enter') {
        this.handleSignIn();
      }
    };

    handleClose = event => {
      this.props.signInClose();
    };

    render() {
      return (
        <Dialog open={this.props.open} onClose={this.handleClose}>
          <DialogTitle>Sign In</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sign in to post a ride or find a ride.
            </DialogContentText>
          </DialogContent>
          <Typography color="error" align="center">
            {this.props.signInFail ? 'Email or password is incorrect' : ''}
          </Typography>
          <DialogContent>
            <TextField
              autoFocus
              label="Email"
              onChange={event => this.handleChange(event, 'email')}
              placeholder="example@carpool.com"
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogContent>
            <TextField
              label="Password"
              type="password"
              onChange={event => this.handleChange(event, 'password')}
              onKeyDown={this.handleKeyDown}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleSignIn}
              color="primary"
              variant="raised"
            >
              Sign In
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }
);
