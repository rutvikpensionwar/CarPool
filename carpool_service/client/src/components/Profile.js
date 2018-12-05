import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextField, Button, Typography, MenuItem } from 'material-ui';
import * as actions from '../actions';

const renderTextField = ({ input, label, meta: { touched, error } }) => {
  return (
    <div style={{ margin: 10, display: 'inline-block' }}>
      <TextField label={label} error={Boolean(touched && error)} {...input} />
      <div
        style={{
          visibility: `${Boolean(!(touched && error)) ? 'hidden' : 'visible'}`
        }}
      >
        <Typography color="error">{error}</Typography>
      </div>
    </div>
  );
};

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children
}) => {
  return (
    <Fragment>
      <TextField
        select
        label={label}
        {...input}
        children={children}
        onChange={event => input.onChange(event.target.value)}
        style={{ minWidth: 100, margin: 10 }}
      />
    </Fragment>
  );
};

const renderDatePicker = ({ input, label, meta: { touched, error } }) => {
  return (
    <Fragment>
      <TextField
        type="date"
        label={label}
        {...input}
        InputLabelProps={{
          shrink: true
        }}
        style={{ margin: 10 }}
      />
    </Fragment>
  );
};

const validate = values => {
  const errors = {};
  ['email', 'fname', 'lname'].forEach(name => {
    if (!values[name]) {
      errors[name] = 'Value is required';
    }
  });

  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }

  return errors;
};

class Profile extends Component {
  componentDidMount() {
    console.log('In Profile, props.auth:', this.props.auth);
  }

  handleSubmit = values => {
    console.log('handleSubmit', values);
    if (values.email) this.props.updateUser(values);
  };

  render() {
    return (
      <form
        onSubmit={this.props.handleSubmit(values => this.handleSubmit(values))}
      >
        <div>
          <Field name="email" label="Email" component={renderTextField} />
        </div>
        <div>
          <Field name="fname" label="First Name" component={renderTextField} />
          <Field name="lname" label="Last Name" component={renderTextField} />
        </div>
        <div>
          <Field
            name="date_of_birth"
            label="Birthday"
            component={renderTextField}
          />
          <Field name="gender" label="Gender" component={renderSelectField}>
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
          </Field>
        </div>
        <div>
          <Field
            name="phone_number"
            label="Phone Number"
            component={renderTextField}
          />
          <Field
            name="license_number"
            label="License Number"
            component={renderTextField}
          />
        </div>
        <div>
          <Field name="company" label="Company" component={renderTextField} />
        </div>
        <div>
          <Field name="address" label="Address" component={renderTextField} />
        </div>
        <div>
          <Button
            variant="raised"
            color="secondary"
            onClick={this.props.reset}
            style={{ margin: 10 }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="raised"
            color="primary"
            onClick={this.handleSubmit}
            style={{ margin: 10 }}
          >
            Submit
          </Button>
        </div>
      </form>
    );
  }
}

Profile = reduxForm({ form: 'profileForm', validate: validate })(Profile);
const mapPropsToState = ({ auth }) => ({
  initialValues: auth,
  auth
});

export default connect(
  mapPropsToState,
  actions
)(Profile);
