import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  Button
} from 'material-ui';

class EditLocation extends Component {
  state = {
    street_name: '',
    city: '',
    state: '',
    country: ''
  };

  handleChange = (event, field) => {
    this.setState({ [field]: event.target.value });
  };

  handleDelete = () => {
    this.props.deleteLocations(this.props.row.location_id);
    this.props.handleClose();
  };

  handleSubmit = () => {
    if (this.props.type == 'Add') {
      this.props.addLocations(
        this.state.street_name,
        this.state.city,
        this.state.state,
        this.state.country
      );
    } else if (this.props.type == 'Edit') {
      this.props.editLocations(
        this.props.row.location_id,
        this.state.street_name,
        this.state.city,
        this.state.state,
        this.state.country
      );
    }
    this.props.handleClose();
  };

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.handleClose}>
        <DialogTitle>{this.props.type} Location</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              label="Street"
              onChange={event => this.handleChange(event, 'street_name')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="City"
              onChange={event => this.handleChange(event, 'city')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="State"
              onChange={event => this.handleChange(event, 'state')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Country"
              onChange={event => this.handleChange(event, 'country')}
              fullWidth
              margin="normal"
            />
            <Button
              variant="raised"
              color="primary"
              style={{ margin: 10 }}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
            {this.props.type == 'Edit' ? (
              <Button
                variant="raised"
                color="secondary"
                style={{ margin: 10 }}
                onClick={this.handleDelete}
              >
                Delete
              </Button>
            ) : (
              <Fragment />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default connect(
  null,
  actions
)(EditLocation);
