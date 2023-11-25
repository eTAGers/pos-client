import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";
import APIKit from "../../utilities/APIKIT";
import { URLS } from "../../utilities/URLS";
import "./Login.css";

function Login(props) {
  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width:600px)");
  const [payload, setPayload] = useState({
    userName: "",
    password: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  var variant = "";
  const anchorOrigin = { horizontal: "right", vertical: "bottom" };
  const loginApi = async (e) => {
    e.preventDefault();

    await APIKit.post(URLS.login, payload).then((res) => {
      if (res.data.message === "Successfully Login") {
        variant = "success";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        sessionStorage.setItem("userData", JSON.stringify(res.data.data));
        navigate("/app/dashboard/", { replace: true });
      } else {
        variant = "error";
        enqueueSnackbar(res.data.message, { variant, anchorOrigin });
        if (res.data.message === "Password Incorrect") {
          setPayload({
            ...payload,
            password: "",
          });
        }
      }
    });
  };
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <div className="loginScreen">
        <div className="container" id="container">
          <div className="form-container sign-in">
            <form onSubmit={loginApi}>
              <h1>Sign In</h1>
              <span>Please sign in to access the system.</span>
              <input
                onChange={(e) => {
                  setPayload({
                    ...payload,
                    userName: e.target.value.trim(),
                  });
                }}
                type="test"
                placeholder="User Name"
              />
              <input
                onChange={(e) => {
                  setPayload({
                    ...payload,
                    password: e.target.value.trim(),
                  });
                }}
                type="password"
                placeholder="Password"
              />
              <button type="submit">Sign In</button>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-right">
                <h1>Hello, Friend!</h1>
                <p>Unlock the power of our POS system with your details!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
