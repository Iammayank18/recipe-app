const MainReducer = (state = [], action) => {
  switch (action.type) {
    case "AUTHENTICATED":
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedin,
        data: action.payload,
      };

    default:
      return state;
  }
};

export default MainReducer;
