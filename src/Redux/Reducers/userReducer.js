import {
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE,
  USER_UPDATE
} from "../Constants/ActionTypes";

const initialState = {
  user: {},
  loading: false,
  error: "",
  updateUser:false
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_REQUEST:
      return {
        ...state,
        user: {},
        loading: true,
        error: "",
      };

    case USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: "",
      };

    case USER_FAILURE:
      return {
        ...state,
        user: {},
        loading: false,
        error: action.payload,
      };
    case USER_UPDATE:
      return {
        ...state,
        updateUser: action.payload,
      };

    default:
      return state;
  }
};
