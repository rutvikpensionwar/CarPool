const initState = {
  signInOpen: false,
  signInFail: false
};

export default (state = initState, action) => {
  switch (action.type) {
    case 'SIGN_IN_OPEN':
      return {
        ...state,
        signInOpen: true
      };
    case 'SIGN_IN_CLOSE':
      return {
        ...state,
        signInOpen: false,
        signInFail: false
      };
    case 'SIGN_IN_FAIL':
      return {
        ...state,
        signInFail: true
      };
    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        signInFail: false
      };
    default:
      return state;
  }
};
