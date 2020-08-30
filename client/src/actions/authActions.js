import axios from "axios";
import setAuthToken from "../util/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, GET_CURRENT_USER, USER_LOADING } from "./types";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios.post("/api/users/register",userData)
  .then(res => history.push("/login"))
  .catch(err=> dispatch({
    type:GET_ERRORS,
    payload:err.response.data
  }))
}
// Get current user	
export const getCurrentUser = () => dispatch => {	
  dispatch(setUserLoading());	
  axios	
    .get("/api/user/currentuser")	
    .then(res =>	
      dispatch({	
        type: GET_CURRENT_USER,	
        payload: res.data	
      })	
    )	
    .catch(err =>	
      dispatch({	
        type: GET_ERRORS,	
        payload: err.response.data	
      })	
    );	
};	

//Login
export const loginUser = (userData) => dispatch => {
  axios.post("/api/users/login",userData)
  .then( res => {
      const {token} = res.data;
      // Set token to localStorage
      localStorage.setItem("jwtToken", JSON.stringify(token));
      // Set token to Auth header
      setAuthToken(token);
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
   }
  )
  .catch(err=> dispatch({
    type:GET_ERRORS,
    payload:err.response.data
  }))
}


// Set logged in user
export const setCurrentUser = decoded_data => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded_data
  };
};
 // User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
// Logout user
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
  