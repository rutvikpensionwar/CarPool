import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import auth from './auth';
import dialog from './dialog';
import post from './post';
import ride from './ride';
import location from './location';
import analytics from './analytics';

export default combineReducers({
  form,
  auth,
  dialog,
  post,
  ride,
  location,
  analytics
});
