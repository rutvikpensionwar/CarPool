import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { TableHead, TableRow, TableBody, TableCell } from 'material-ui';

class Users extends Component {
  componentDidMount() {
    this.props.fetchAllUsers();
  }

  render() {
    return (
      <div>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Birthday</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>License Number</TableCell>
            <TableCell>Car Registration Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.auth.all ? (
            this.props.auth.all.map(row => (
              <TableRow key={row.email}>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.fname}</TableCell>
                <TableCell>{row.lname}</TableCell>
                <TableCell>{row.date_of_birth}</TableCell>
                <TableCell>{row.company}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.phone_number}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.license_number}</TableCell>
                <TableCell>{row.car_reg_number}</TableCell>
              </TableRow>
            ))
          ) : (
            <Fragment />
          )}
        </TableBody>
      </div>
    );
  }
}

export default connect(
  ({ auth }) => ({ auth }),
  actions
)(Users);
