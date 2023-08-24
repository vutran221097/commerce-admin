import axios from "axios";
import Cookies from 'universal-cookie';
import { store } from '../store'
import { logOut } from "../reducer/authReducer";
import SERVER from '../config.server'
const cookies = new Cookies();

const Axios = axios.create({
  // Configuration
  baseURL: SERVER,
  headers: { 'x-access-token': cookies.get("jwt_auth_admin") }
});

//validate response
Axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status === 401) {
    store.dispatch(logOut());
    return window.location.href = '/'
  }
  return Promise.reject(error);
});

export default Axios;
