import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./Login.css";
import Navbar from "../../components/Navbar/Navbar";
import useInput from "../../customHook/useInput";
import Axios from "../../api/Axios";
import { logIn } from "../../reducer/authReducer";
import { toastNoti } from "../../utils/utils";
import { useEffect } from "react";

const Login = () => {
  const email = useInput("email");
  const password = useInput("password");
  const isLogged = useSelector((state) => state.auth.isLogged)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isLogged) return
    navigate('/dashboard')
    // eslint-disable-next-line
  }, [])

  const onLogin = async () => {
    try {
      const res = await Axios.post('/auth/sign-in', {
        email: email.value,
        password: password.value
      })
      if (res.status === 200) {
        if (res.data.user.role === 'user') {
          toastNoti("You dont have permission to login!", "error")
          email.reset()
          password.reset()
          return;
        }
        dispatch(logIn(res.data))
        navigate('/dashboard')
        toastNoti("Login success!", "success")
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="login-container">
        <h1>Login</h1>
        <div className="control-group">
          <div className={`form-control ${email.error ? "invalid" : ""}`}>
            <input
              type="email"
              name="email"
              onChange={email.onChange}
              onBlur={email.onBlur}
              placeholder="Email"
              value={email.value}
            />
            {email.error && email.touched && (
              <div className="error-text">{email.error}</div>
            )}
          </div>

          <div className={`form-control ${password.error ? "invalid" : ""}`}>
            <input
              type="password"
              name="password"
              onChange={password.onChange}
              onBlur={password.onBlur}
              placeholder="Password"
              value={password.value}
            />
            {password.error && password.touched && (
              <div className="error-text">{password.error}</div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
