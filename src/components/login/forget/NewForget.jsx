import React, { useState } from "react";
import { RiShieldUserLine } from "react-icons/ri";
import "./NewForget.css";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import axios from "axios";

const NewForget = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const api_url = import.meta.env.VITE_API_URL

  console.log("ENV VALUE →", import.meta.env.VITE_API_URL);



  const [formData, setFormData] = useState({
    email: "",
    message: "",
    isEmailValid: false,
    showOtp: false,
  });

  console.log(api_url, "formdata");

  // Email Handler
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      email: value,
      message: "",
      isEmailValid: false,
      showOtp: false,
    }));
  };

  // Sweetalert Toast
  const showToast = async (icon, title) => {
    let timerInterval;

    const Toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,

      // Progress bar color change based on success / error
      didOpen: (toast) => {
        // change progress bar color
        const progressBar = toast.querySelector(".swal2-timer-progress-bar");
        progressBar.style.background =
          icon === "success" ? "green" : "red";

        // Pause on hover
        toast.addEventListener("mouseenter", () => {
          Swal.stopTimer();
        });

        // Resume on mouse leave
        toast.addEventListener("mouseleave", () => {
          Swal.resumeTimer();
        });
      },

      // Custom popup color classes
      customClass: {
        popup: icon === "success" ? "colored-toast" : "colored-toast-error",
      },

      iconColor: icon === "success" ? "green" : "red",
    });

    await Toast.fire({ icon, title });
  };

  // Handle "Confirm" Without Integration
  const handleConfirmClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    const value = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Basic validation
    if (!value) {
      await showToast("error", "Email ID is required.");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(value)) {
      await showToast("error", "Enter your valid Email ID.");
      setLoading(false);
      return;
    }

    // 🔥 FRONTEND-ONLY — simulate delay
    try {
      // 🔥 Backend API
      const res = await axios.post(`${api_url}/forgot-password`, {
        email: value,
      });

      await showToast("success", res.data.message || "OTP sent successfully");


      navigate("/otp", {
        state: {
          email: value,
          otp_expires: res.data.otp_expires, // backend must return expiry
        },
      });

    } catch (error) {
      await showToast(
        "error",
        error.response?.data?.message || "Something went wrong"
      );
    }

    setLoading(false);
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div
      className="min-vh-100 newforgot-div d-flex align-items-center justify-content-center"
      style={{ background: "#e7e7e7" }}
    >
      <div className="container py-5">
        <div className="container-fluid d-flex justify-content-center align-items-center flex-column">
          <div className="newforgetbox">
            {/* Header */}
            <div className="text-center my-4">
              <div
                className="d-flex align-items-center justify-content-center peacock-color-bg rounded-circle mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <RiShieldUserLine color="white" size={30} />
              </div>
              <h3 className="text-center red-color-text">Forgot password</h3>
              <p className="text-secondary fs-6 text-center">
                Enter your Email ID to reset password
              </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Email */}
              <div className="mb-4 mt-5">
                <TextField
                  label="Email ID"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                  sx={{
                    "& .MuiFormLabel-asterisk": {
                      display: "none",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                      borderColor: "#0e4d65",
                      borderWidth: "2px",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#0e4d65",
                    },
                  }}
                />
              </div>

              {/* Button */}
              <button
                type="button"
                className="text-center newforget-btn text-white mt-4 peacock-color-bg d-flex align-items-center justify-content-center"
                onClick={handleConfirmClick}
                disabled={loading}
                style={{
                  width: "100%",
                  height: "42px",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></div>
                ) : (
                  "Confirm"
                )}
              </button>

              <p
                className="text-secondary newforgot-btn2 fs-6 text-center mt-4"
                onClick={goToLogin}
                style={{ cursor: "pointer" }}
              >
                <MdOutlineKeyboardBackspace className="mb-1 me-1" />
                Back to login
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default NewForget

