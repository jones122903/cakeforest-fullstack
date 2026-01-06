import React, { useState } from "react";
import { RiShieldUserLine } from "react-icons/ri";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import style from "./NewReset.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import { showHotToast } from "../../../admin/utils/showToast";

const NewReset = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const api_url = import.meta.env.VITE_API_URL;

  // Get email from previous page
  const emailFromState = location.state?.email || "";

  // Password rules check
  const rules = {
    length: password.length >= 8,
    case: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allRulesValid =
    rules.length && rules.case && rules.number && rules.special;

  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const canSubmit = allRulesValid && passwordsMatch && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) return;

    if (!emailFromState) {
      showHotToast("error", "Email not found. Please restart the reset process.");
      navigate("/forget-password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${api_url}/reset-password`, {
        email: emailFromState,
        password: password,
      });

      if (response.data.success) {

        await showHotToast("success","Your password has been changed successfully.")
      
        // Navigate back to login page
        navigate("/login");
      } else {
        showHotToast("error", response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      showHotToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "#e7e7e7" }}
    >
      <div className="container py-5" style={{ position: "fixed" }}>
        <div className="container-fluid d-flex justify-content-center align-items-center flex-column">
          <div className={`${style.cardBox}`}>
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="d-flex align-items-center justify-content-center peacock-color-bg rounded-circle mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <RiShieldUserLine color="white" size={30} />
              </div>

              <h2 className={`${style.marginHfour} text-center red-color-text`}>
                Reset Password
              </h2>
              <p className="text-secondary fs-6">Create a new password</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-4">
                <TextField
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  type={showNewPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <VscEye /> : <VscEyeClosed />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": { color: "#0e4d65" },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: "#0e4d65",
                    },
                    "& .MuiFormLabel-asterisk": { display: "none" },
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <VscEye />
                          ) : (
                            <VscEyeClosed />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": { color: "#0e4d65" },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: "#0e4d65",
                    },
                    "& .MuiFormLabel-asterisk": { display: "none" },
                  }}
                />
              </div>

              {/* Password Rules */}
              <div className="mb-3">
                <div className="border border-danger-subtle bg-opacity-10 rounded-3 p-3">
                  <div className="small text-danger">
                    <p className="fw-semibold text-black mb-1">
                      Password Requirements:
                    </p>
                    <ul className="list-unstyled ms-3 mb-0 small">
                      {/* 1 */}
                      <li
                        className={`d-flex align-items-center mb-1 ${rules.length ? "text-success" : "text-danger"
                          }`}
                      >
                        {rules.length ? (
                          <FaCheckCircle size={10} className="me-2" />
                        ) : (
                          <FaTimesCircle size={10} className="me-2" />
                        )}
                        Must be at least 8 characters long
                      </li>

                      {/* 2 */}
                      <li
                        className={`d-flex align-items-center mb-1 ${rules.case ? "text-success" : "text-danger"
                          }`}
                      >
                        {rules.case ? (
                          <FaCheckCircle size={10} className="me-2" />
                        ) : (
                          <FaTimesCircle size={10} className="me-2" />
                        )}
                        Must include uppercase and lowercase letters
                      </li>

                      {/* 3 */}
                      <li
                        className={`d-flex align-items-center mb-1 ${rules.number ? "text-success" : "text-danger"
                          }`}
                      >
                        {rules.number ? (
                          <FaCheckCircle size={10} className="me-2" />
                        ) : (
                          <FaTimesCircle size={10} className="me-2" />
                        )}
                        Must include at least one number
                      </li>

                      {/* 4 */}
                      <li
                        className={`d-flex align-items-center mb-1 ${rules.special ? "text-success" : "text-danger"
                          }`}
                      >
                        {rules.special ? (
                          <FaCheckCircle size={10} className="me-2" />
                        ) : (
                          <FaTimesCircle size={10} className="me-2" />
                        )}
                        Must include at least one special character
                      </li>

                      {/* 5 */}
                      <li
                        className={`d-flex align-items-center mb-1 ${passwordsMatch ? "text-success" : "text-danger"
                          }`}
                      >
                        {passwordsMatch ? (
                          <FaCheckCircle size={10} className="me-2" />
                        ) : (
                          <FaTimesCircle size={10} className="me-2" />
                        )}
                        Both passwords must be the same.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`text-center mt-2 violet-color-bg ${style.submitButton}`}
                style={{
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReset
