import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import {
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Chip,
  Radio,
  RadioGroup
} from 'material-ui';
import locationMap from '../../locationMap';
import moment from 'moment';

const getDefaultTime = () => {
  return {
    startTime: moment().format('YYYY-MM-DD') + 'T00:00',
    endTime: moment().format('YYYY-MM-DD') + 'T00:00'
  };
};

const renderTextField = ({ input, label, meta: { touched, error } }) => {
  return (
    <div style={{ margin: 10 }}>
      <TextField label={label} {...input} />
    </div>
  );
};

const renderDateTimePicker = ({ input, label, meta: { touched, error } }) => {
  return (
    <div style={{ margin: 10 }}>
      <TextField
        type="datetime-local"
        label={label}
        {...input}
        InputLabelProps={{
          shrink: true
        }}
      />
    </div>
  );
};

class Post extends Component {
  componentDidMount() {
    this.props.fetchPost();
  }

  submitPost = values => {
    let source_id = locationMap.get(values.source);
    let destination_id = locationMap.get(values.destination);

    let post = {
      post_type: values.type,
      source_id: source_id,
      destination_id: destination_id,
      window_start_time: values.startTime,
      window_end_time: values.endTime
    };
    console.log('submit', post);
    this.props.sendPost(post);
  };

  sendMatch = () => {
    this.props.sendMatch();
  };

  renderForm = () => {
    if (this.props.post && this.props.post.today) {
      console.log('post today: ', this.props.post.today);
      return (
        <Paper style={{ marginTop: 10 }}>
          <Typography color="inherit" variant="subheading" align="center">
            {'Post Id: '}
            {this.props.post.today.post_id}
          </Typography>
          <Stepper>
            <Step>
              <StepLabel>{this.props.post.today.source}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{this.props.post.today.destination}</StepLabel>
            </Step>
          </Stepper>
          <Typography color="inherit" variant="subheading" align="center">
            {'From: '}
            {this.props.post.today.startTime}
          </Typography>
          <Typography color="inherit" variant="subheading" align="center">
            {'To: '}
            {this.props.post.today.endTime}
          </Typography>
          {this.props.post.today.post_type == 'driver' ? (
            <Button
              variant="raised"
              color="primary"
              style={{ margin: 10 }}
              onClick={this.sendMatch}
            >
              Match
            </Button>
          ) : (
            <Fragment />
          )}
          <Button
            variant="raised"
            color="secondary"
            style={{ margin: 10 }}
            onClick={() => this.props.deletePost(this.props.post.today.post_id)}
          >
            Delete
          </Button>
        </Paper>
      );
    } else {
      return (
        <form
          onSubmit={this.props.handleSubmit(values => this.submitPost(values))}
        >
          <Field
            name="type"
            label="Type (Driver/Rider)"
            component={renderTextField}
          />
          <Field name="source" label="Source" component={renderTextField} />
          <Field
            name="destination"
            label="Destination"
            component={renderTextField}
          />
          <Field
            name="startTime"
            label="Start time"
            component={renderDateTimePicker}
          />
          <Field
            name="endTime"
            label="End time"
            component={renderDateTimePicker}
          />
          <div>
            <Button
              type="submit"
              variant="raised"
              color="primary"
              style={{ margin: 10 }}
            >
              Post
            </Button>
          </div>
        </form>
      );
    }
  };

  render() {
    return this.renderForm();
  }
}

export default connect(
  ({ auth, post }) => ({ auth, post }),
  actions
)(
  reduxForm({
    form: 'matchPost',
    initialValues: getDefaultTime()
  })(Post)
);
