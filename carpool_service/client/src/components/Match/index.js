import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Paper, Tab, Tabs } from 'material-ui';
import { Link } from 'react-router-dom';
import Post from './Post';
import Ride from './Ride';
import History from './History';

class Match extends Component {
  renderPage = () => {
    switch (this.props.location.pathname) {
      case '/home': // post
        return <Post />;
      case '/home/ride':
        return <Ride />;
      case '/home/history':
        return <History />;
    }
  };

  render() {
    return (
      <Fragment>
        <Paper style={{ marginTop: 10 }}>
          <Tabs value={this.props.location.pathname} centered>
            <Tab value="/home" label="Post" component={Link} to="/home" />
            <Tab
              value="/home/ride"
              label="Ride"
              component={Link}
              to="/home/ride"
            />
            <Tab
              value="/home/history"
              label="History"
              component={Link}
              to="/home/history"
            />
          </Tabs>
        </Paper>
        {this.renderPage()}
      </Fragment>
    );
  }
}

export default Match;
