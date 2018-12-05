import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Paper, Tab, Tabs } from 'material-ui';
import { Link } from 'react-router-dom';
import Statistic from './Statistic';
import Users from './Users';
import Locations from './Locations';

const Rides = props => <div>Rides</div>;

class Admin extends Component {
  renderPage = () => {
    switch (this.props.location.pathname) {
      case '/home':
        return <Statistic />;
      case '/home/users':
        return <Users />;
      case '/home/locations':
        return <Locations />;
      // case '/home/rides':
      //   return <Rides />;
    }
  };

  render() {
    return (
      <Fragment>
        <Paper style={{ marginTop: 10 }}>
          <Tabs value={this.props.location.pathname} centered>
            <Tab value="/home" label="Statistic" component={Link} to="/home" />
            <Tab
              value="/home/users"
              label="Users"
              component={Link}
              to="/home/users"
            />
            <Tab
              value="/home/locations"
              label="Locations"
              component={Link}
              to="/home/locations"
            />
          </Tabs>
        </Paper>
        {this.renderPage()}
      </Fragment>
    );
  }
}

export default Admin;

// <Tab
//   value="/home/rides"
//   label="Rides"
//   component={Link}
//   to="/home/rides"
// />
