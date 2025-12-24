import React, { useState } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { LuUser, LuLock, LuMail } from "react-icons/lu";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../redux/slice/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { showHotToast } from "../../admin/utils/showToast.jsx";
import "./login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    loginType: "EMAIL",
    picture: ""
  });

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  // Loading states
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);

  // Password visibility states
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Google Login Hook
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
          access_token: tokenResponse.access_token,
        });

        if (response.data.success) {
          dispatch(setToken({
            token: response.data.token,
            // user: response.data.user
            user: {
              id: response.data.user._id,
              name: response.data.user.name,
              email: response.data.user.email
            }
          }));
          showHotToast("success", "Google Login Successful");
          setTimeout(() => {
            navigate("/");
          }, 1600);
        }
      } catch (error) {
        console.error(error);
        showHotToast("error", "Google Login Failed");
      }
    },
    onError: () => showHotToast("error", "Google Login Failed"),
  });

  // Show Toast Notification (same as AddProduct.jsx)


  // Handle Sign Up form changes
  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Sign In form changes
  const handleSignInChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value
    });
  };



  // Handle Sign Up submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation
    if (!signUpData.name.trim()) {
      showHotToast("error", "Name is required");
      return;
    }

    if (!signUpData.email.trim()) {
      showHotToast("error", "Email address is required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email)) {
      showHotToast("error", "Enter a valid email address");
      return;
    }

    if (!signUpData.password) {
      showHotToast("error", "Password is required");
      return;
    }

    if (signUpData.password.length < 6) {
      showHotToast("error", "Password must be at least 6 characters long");
      return;
    }

    setSignUpLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, signUpData);

      if (response.data.success) {
        showHotToast("success", response.data.message || "Account created successfully. Continue by signing in");
        // Clear form
        setSignUpData({ name: "", email: "", password: "", loginType: "EMAIL", picture: "" });
        // Switch to sign in after toast
        setTimeout(() => setActive(false), 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unable to create account. Try again."; showHotToast("error", errorMessage);
    } finally {
      setSignUpLoading(false);
    }
  };

  // Handle Sign In submission
  const handleSignIn = async (e) => {
    e.preventDefault();

    // Validation
    if (!signInData.email.trim()) {
      showHotToast("error", "Email address is required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signInData.email)) {
      showHotToast("error", " Enter a valid email address");
      return;
    }

    if (!signInData.password) {
      showHotToast("error", "Password is required");
      return;
    }

    setSignInLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, signInData);

      if (response.data.success) {
        // Store token and user in Redux
        dispatch(setToken({
          token: response.data.token,
          user: response.data.user
        }));

        // Clear form
        setSignInData({ email: "", password: "" });

        // Show success toast first, then navigate after toast completes
        showHotToast("success", response.data.message || "Welcome back! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 1600);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unable to sign in. Check your credentials and try again.";
      showHotToast("error", errorMessage);
    } finally {
      setSignInLoading(false);
    }
  };

  return (
    <div className="login-1">
      <div className={`container-login ${active ? "active" : ""}`} id="container">

        {/* SIGN UP FORM */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp} autoComplete="off">
            <h1>Create Account</h1>

            <div className="social-icons">
              <a href="#" onClick={(e) => { e.preventDefault(); handleGoogleLogin() }} className="icon"><FaGoogle /></a>
              <a href="https://www.facebook.com/login" target="_blank" rel="noopener noreferrer" className="icon"><FaFacebookF /></a>
              <a href="https://github.com/login" target="_blank" rel="noopener noreferrer" className="icon"><FaGithub /></a>
              <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer" className="icon"><FaLinkedinIn /></a>
            </div>

            <span>or use your email for registration</span>

            {/* Name */}
            <TextField
              label="Name"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={signUpData.name}
              onChange={handleSignUpChange}
              autoComplete="off"
              inputProps={{ autoComplete: 'off' }}
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
              name="email"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={signUpData.email}
              onChange={handleSignUpChange}
              autoComplete="off"
              inputProps={{ autoComplete: 'off' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuMail size={20} color="#0e4d65" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              label="Password"
              name="password"
              type={showSignUpPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={signUpData.password}
              onChange={handleSignUpChange}
              autoComplete="new-password"
              inputProps={{ autoComplete: 'new-password' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuLock color="#0e4d65" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <div
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showSignUpPassword ? <IoEyeOff size={20} color="#0e4d65" /> : <IoEye size={20} color="#0e4d65" />}
                    </div>
                  </InputAdornment>
                ),
              }}
            />

            <button type="submit" disabled={signUpLoading}>
              {signUpLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing Up...
                </>
              ) : "Sign Up"}
            </button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn} autoComplete="off">
            <h1>Sign In</h1>

            <div className="social-icons">
              <a href="#" onClick={(e) => { e.preventDefault(); handleGoogleLogin() }} className="icon"><FaGoogle /></a>
              <a href="https://www.facebook.com/login" target="_blank" rel="noopener noreferrer" className="icon"><FaFacebookF /></a>
              <a href="https://github.com/login" target="_blank" rel="noopener noreferrer" className="icon"><FaGithub /></a>
              <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer" className="icon"><FaLinkedinIn /></a>
            </div>

            <span>or use your email password</span>

            {/* Email */}
            <TextField
              label="Email"
              name="email"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={signInData.email}
              onChange={handleSignInChange}
              autoComplete="off"
              inputProps={{
                autoComplete: 'off',
                readOnly: true,
                onFocus: (e) => e.target.removeAttribute('readonly')
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuMail size={20} color="#0e4d65" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              label="Password"
              name="password"
              type={showSignInPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={signInData.password}
              onChange={handleSignInChange}
              autoComplete="off"
              inputProps={{
                autoComplete: 'off',
                readOnly: true,
                onFocus: (e) => e.target.removeAttribute('readonly')
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LuLock color="#0e4d65" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <div
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {showSignInPassword ? <IoEyeOff size={20} color="#0e4d65" /> : <IoEye size={20} color="#0e4d65" />}
                    </div>
                  </InputAdornment>
                ),
              }}
            />

            <a href="#">Forgot Password?</a>

            <button type="submit" disabled={signInLoading}>
              {signInLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        {/* TOGGLE PANEL */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back</h1>
              <p>Sign in with your details to continue.</p>
              <button className="hidden" onClick={() => setActive(false)}>Sign In</button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Join Us</h1>
              <p>Register to create your account and start using all features.</p>
              <button className="hidden" onClick={() => setActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
