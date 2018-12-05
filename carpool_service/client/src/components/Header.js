import React, { Component, Fragment } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem
} from 'material-ui';
import { AccountCircle } from 'material-ui-icons';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions';

const mapPropsToState = ({ auth }) => ({ auth });

export default connect(
  mapPropsToState,
  actions
)(
  class extends Component {
    state = {
      menuOpen: false,
      menuAnchorEl: null
    };

    handleLoginClick = event => {
      this.props.signInOpen();
    };

    handleMenuClick = event => {
      this.setState({ menuAnchorEl: event.currentTarget });
    };

    handleMenuClose = event => {
      this.setState({ menuAnchorEl: null });
    };

    handleLogoutClick = event => {
      this.setState({ menuAnchorEl: null });
      this.props.signOut();
    };

    render() {
      return (
        <AppBar position="static">
          <Toolbar>
            <Typography
              component={Link}
              to={this.props.auth ? '/home' : '/'}
              variant="headline"
              color="inherit"
              style={{ flex: 1, textDecoration: 'none' }}
            >
              Carpool
            </Typography>
            {this.props.auth ? (
              <Fragment>
                <Typography color="inherit">{this.props.auth.email}</Typography>
                <IconButton color="inherit" onClick={this.handleMenuClick}>
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.menuAnchorEl}
                  open={Boolean(this.state.menuAnchorEl)}
                  onClose={this.handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                >
                  <MenuItem
                    onClick={this.handleMenuClose}
                    component={Link}
                    to="/profile"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={this.handleLogoutClick}>Sign Out</MenuItem>
                </Menu>
              </Fragment>
            ) : (
              <Button color="inherit" onClick={this.handleLoginClick}>
                Sign In
              </Button>
            )}
          </Toolbar>
        </AppBar>
      );
    }
  }
);
