export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_USER':
      if (action.payload && action.payload.date_of_birth) {
        action.payload.date_of_birth = action.payload.date_of_birth.substr(
          0,
          10
        );
      }
      return action.payload || null;
    case 'FETCH_ALL_USER':
      return {
        ...state,
        all: action.payload
      };
    default:
      return state;
  }
};
