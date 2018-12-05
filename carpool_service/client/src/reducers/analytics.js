export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_ANALYTICS':
      return {
        ...state,
        matched: action.payload['@matched_riders'],
        unmatched: action.payload['@unmatached_riders']
      };
    case 'FETCH_ANALYTICS_HISTORY':
      return {
        ...state,
        matched_history: action.payload['@matched_riders'],
        unmatched_history: action.payload['@unmatached_riders']
      };
    default:
      return state;
  }
};
