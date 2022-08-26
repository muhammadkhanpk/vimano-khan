import {
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE,
  USER_UPDATE
} from "../Constants/ActionTypes";

export const userRequest = () => {
  return {
    type: USER_REQUEST,
  };
};

export const userSuccess = (user) => {
  return {
    type: USER_SUCCESS,
    payload: user,
  };
};

export const userFailure = (error) => {
  return {
    type: USER_FAILURE,
    payload: error,
  };
};
export const userUpdate = (flag) => {
  return {
    type: USER_UPDATE,
    payload: flag,
  };
};
