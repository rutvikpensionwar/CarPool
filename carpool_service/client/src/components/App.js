import React, { Fragment, Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Header from './Header';
import SignIn from './Dialogs/SignIn';
import Landing from './Landing';
import Profile from './Profile';
import Match from './Match';
import Admin from './Admin';

const mapStateToProps = ({ auth }) => ({
  auth
});

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Fragment>
            <SignIn />
            <Header />
            <Route
              exact
              path="/"
              render={props =>
                !this.props.auth ? (
                  <Landing handleSignup={this.handleSignup} {...props} />
                ) : (
                  <Redirect
                    to={{
                      pathname: '/home',
                      state: { from: props.location }
                    }}
                  />
                )
              }
            />
            <Route
              exact
              path="/profile"
              render={props =>
                this.props.auth ? (
                  <Profile {...props} />
                ) : (
                  <Redirect
                    to={{
                      pathname: '/',
                      state: { from: props.location }
                    }}
                  />
                )
              }
            />
            <Route
              path="/home"
              render={props => {
                if (this.props.auth) {
                  return this.props.auth.email == 'admin@sjsu.edu' ? (
                    <Admin {...props} />
                  ) : (
                    <Match {...props} />
                  );
                } else {
                  return (
                    <Redirect
                      to={{
                        pathname: '/',
                        state: { from: props.location }
                      }}
                    />
                  );
                }
              }}
            />
          </Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(App);
