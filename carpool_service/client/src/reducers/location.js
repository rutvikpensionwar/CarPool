export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_LOCATIONS':
      console.log('in FETCH_LOCATION reducer, payload', action.payload);
      return action.payload;
    default:
      return state;
  }
};
