import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import Axios from "../api/Axios";
const cookies = new Cookies()

const initialState = {
  currentUser: {},
  isLogged: false,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // login action
    logIn(state, action) {
      const { user, accessToken } = action.payload;
      cookies.set("jwt_auth_admin", accessToken)
      state.isLogged = true;
      state.currentUser = user
      Axios.interceptors.request.use(config => {
        config.headers['x-access-token'] = accessToken;
        return config;
      });
      return state;
    },
    // logout action
    logOut(state) {
      state.isLogged = false;
      state.currentUser = {};
      cookies.remove("jwt_auth_admin")
      return state;
    }
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
