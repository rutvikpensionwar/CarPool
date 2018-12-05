export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_RIDE':
      return action.payload
        ? {
            ...state,
            today: {
              driver: action.payload.email,
              startTime: action.payload.journey_start_time,
              carRegNum: action.payload.car_reg_number,
              source: action.payload.source,
              destination: action.payload.destination,
              riders: action.payload.matches.map(match => {
                if (match.post_type == 'rider') {
                  return match.email;
                }
              })
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
