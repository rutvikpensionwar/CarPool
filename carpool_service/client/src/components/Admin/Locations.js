import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { TableHead, TableRow, TableBody, TableCell, Button } from 'material-ui';
import EditLocation from '../Dialogs/EditLocation';

class Locations extends Component {
  state = {
    editOpen: false,
    editKey: null,
    type: '',
    content: null
  };

  componentDidMount() {
    this.props.fetchLocations();
  }

  handleEditClick = row => {
    this.setState({ editOpen: true, row: row, type: 'Edit' });
  };

  handleEditClose = () => {
    this.setState({ editOpen: false, row: null });
  };

  handleAddClick = () => {
    this.setState({ editOpen: true, row: null, type: 'Add' });
  }

  render() {
    return (
      <div>
        <TableHead>
          <TableRow>
            <TableCell>Street Name</TableCell>
            <TableCell>City</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Conutry</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.location ? (
            this.props.location.map(row => (
              <TableRow key={row.location_id}>
                <TableCell>{row.street_name}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.state}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>
                  <Button
                    variant="raised"
                    onClick={() => this.handleEditClick(row)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <Fragment />
          )}
        </TableBody>
        <Button style={{marginTop: 10}} variant="raised" color="primary" onClick={this.handleAddClick}>
          Add
        </Button>
        <EditLocation
          open={this.state.editOpen}
          handleClose={this.handleEditClose}
          editKey={this.state.editKey}
          type={this.state.type}
          row={this.state.row}
        />
      </div>
    );
  }
}

export default connect(
  ({ location }) => ({ location }),
  actions
)(Locations);
