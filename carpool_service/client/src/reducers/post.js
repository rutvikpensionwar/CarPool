export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_POST':
      return action.payload
        ? {
            ...state,
            today: {
              post_id: action.payload.post_id,
              post_type: action.payload.post_type,
              source: action.payload.source,
              destination: action.payload.destination,
              startTime: action.payload.window_start_time,
              endTime: action.payload.window_end_time
            }
          }
        : {
            ...state
          };
    case 'FETCH_HISTORY':
      return {
        ...state,
        history: action.payload
      };
    default:
      return state;
  }
};
