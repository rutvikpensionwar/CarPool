import axios from 'axios';
import moment from 'moment';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current');
  dispatch({ type: 'FETCH_USER', payload: res.data[0] });
};

export const fetchAllUsers = () => async dispatch => {
  const res = await axios.get('/api/users');
  dispatch({ type: 'FETCH_ALL_USER', payload: res.data });
};

export const signIn = (email, password) => async dispatch => {
  try {
    const res = await axios.post('/api/signin', {
      email,
      password
    });
    dispatch({ type: 'SIGN_IN_CLOSE' });
    dispatch({ type: 'SIGN_IN_SUCCESS' });
    dispatch({ type: 'FETCH_USER', payload: res.data });
    window.location.reload();
  } catch (err) {
    dispatch({ type: 'SIGN_IN_FAIL' });
  }
};

export const signUp = (email, password) => async dispatch => {
  console.log(
    'signUp for',
    { email: email, password: password, gender: 'M' }
  );
  const res = await axios.post(
    '/api/signup',
    { email: email, password: password, gender: 'M' }
  );

  await axios.post('/api/signin', {
    email,
    password
  });
  const signInRes = await axios.get('/api/current');
  dispatch({ type: 'FETCH_USER', payload: signInRes.data[0] });
  window.location.reload();
};

export const signOut = () => async dispatch => {
  axios.get('/api/logout');
  dispatch({ type: 'FETCH_USER', payload: null });
};

export const updateUser = user => async dispatch => {
  console.log('In updateUser,', user);
  const res = await axios.post('/api/users/update', user);
  const current = await axios.get('/api/current');
  dispatch({ type: 'FETCH_USER', payload: current.data[0] });
};

export const signInOpen = () => ({
  type: 'SIGN_IN_OPEN'
});

export const signInClose = () => ({
  type: 'SIGN_IN_CLOSE'
});

export const sendPost = post => async dispatch => {
  console.log('Send post,', post);
  const res = await axios.post('/api/posts/add', post);
  window.location.reload();
};

export const sendMatch = post => async dispatch => {
  const match = await axios.post('/api/posts/match');
  console.log('post match');
  window.location.reload();
};

export const fetchPost = () => async dispatch => {
  const post = await axios.get('/api/posts/today');
  if (!post || !post.data || !post.data[0]) return;
  console.log('post in fetchPost:', post.data[0]);
  const source = await axios.get(`/api/locations/${post.data[0].source_id}`);
  const destination = await axios.get(
    `/api/locations/${post.data[0].destination_id}`
  );
  dispatch({
    type: 'FETCH_POST',
    payload: {
      post_id: post.data[0].post_id,
      post_type: post.data[0].post_type,
      window_start_time: moment(post.data[0].window_start_time).format(
        'MM-DD LT'
      ),
      window_end_time: moment(post.data[0].window_end_time).format('MM-DD LT'),
      source: source.data[0].city,
      destination: destination.data[0].city
    }
  });
};

export const deletePost = post_id => async dispatch => {
  await axios.post('/api/posts/delete/' + post_id);
  window.location.reload();
};

export const fetchRide = () => async dispatch => {
  const ride = await axios.get('/api/rides/today');
  console.log('ride in fetchRide:', ride.data[0]);
  if (!ride.data[0]) return;
  const source = await axios.get(`/api/locations/${ride.data[0].source_id}`);
  const destination = await axios.get(
    `/api/locations/${ride.data[0].destination_id}`
  );
  const matches = await axios.get(
    `/api/posts/show_matches/${ride.data[0].ride_id}`
  );
  console.log('matches in fetchRide:', matches.data);
  // Remove driver
  if (!matches.data || !matches.data[0]) return;
  let dirver = matches.data[0].email;
  matches.data.shift(); // remove array[0]

  dispatch({
    type: 'FETCH_RIDE',
    payload: {
      email: dirver,
      journey_start_time: moment(ride.data[0].journey_start_time).format(
        'MM-DD LT'
      ),
      car_reg_number: ride.data[0].car_reg_number,
      source: source.data[0].city,
      destination: destination.data[0].city,
      matches: matches.data
    }
  });
};

export const fetchHistory = () => async dispatch => {
  const history = await axios.get('/api/rides/history');
  console.log('fetchHistory, history =', history.data);
  dispatch({ type: 'FETCH_HISTORY', payload: history.data });
};

export const fetchLocations = () => async dispatch => {
  const location = await axios.get('/api/locations');
  console.log('fetchLocations, location =', location.data);
  dispatch({ type: 'FETCH_LOCATIONS', payload: location.data });
};

export const addLocations = (
  street_name,
  city,
  state,
  country
) => async dispatch => {
  console.log('addLocations,', street_name, city, state, country);
  const res = await axios.post('/api/locations/add', {
    street_name: street_name,
    city: city,
    state: state,
    country: country
  });
  const location = await axios.get('/api/locations');
  dispatch({ type: 'FETCH_LOCATIONS', payload: location.data });
};

export const editLocations = (
  location_id,
  street_name,
  city,
  state,
  country
) => async dispatch => {
  console.log('editlocation,', street_name, city, state, country);
  const res = await axios.post(`/api/locations/update/${location_id}`, {
    street_name: street_name,
    city: city,
    state: state,
    country: country
  });
  const location = await axios.get('/api/locations');
  dispatch({ type: 'FETCH_LOCATIONS', payload: location.data });
};

export const deleteLocations = location_id => async dispatch => {
  console.log('deleteLocations');
  const res = await axios.post(`/api/locations/delete/${location_id}`);
  const location = await axios.get('/api/locations');
  dispatch({ type: 'FETCH_LOCATIONS', payload: location.data });
};

export const fetchAnalytics = () => async dispatch => {
  console.log('analytics');
  const res = await axios.get('/api/analytics/today');
  console.log('analytics show,', res.data[0][0]);
  dispatch({ type: 'FETCH_ANALYTICS', payload: res.data[0][0] });
};

export const fetchAnalyticsHistory = () => async dispatch => {
  console.log('analyticsHistory');
  const res = await axios.get('/api/analytics/all');
  console.log('analytics show,', res.data[0][0]);
  dispatch({ type: 'FETCH_ANALYTICS_HISTORY', payload: res.data[0][0] });
};
