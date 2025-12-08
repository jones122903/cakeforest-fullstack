import React, { useState } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { LuUser } from "react-icons/lu";
import { LuLock } from "react-icons/lu";
import { LuMail } from "react-icons/lu";

import "./login.css";

const Login = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="login-1">
      <div className={`container-login ${active ? "active" : ""}`} id="container">

        {/* SIGN UP FORM */}
        <div className="form-container sign-up">
          <form>
            <h1>Create Account</h1>

            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>

            <span>or use your email for registration</span>

            {/* Name */}
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuUser size={20} color="#2C5F7C" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Email */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuMail color="#0e4d65" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuLock color="#0e4d65" />
                  </InputAdornment>
                ),
              }}
            />

            <button type="button">Sign Up</button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in">
          <form>
            <h1>Sign In</h1>

            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>

            <span>or use your email password</span>

            {/* Email */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuMail color="#0e4d65" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuLock color="#0e4d65" />
                  </InputAdornment>
                ),
              }}
            />

            <a href="#">Forgot Password?</a>

            <button type="button">Sign In</button>
          </form>
        </div>

        {/* TOGGLE PANEL */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to access all features</p>
              <button className="hidden" onClick={() => setActive(false)}>Sign In</button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all features</p>
              <button className="hidden" onClick={() => setActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
