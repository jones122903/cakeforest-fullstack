import React, { useState, useEffect, useRef } from "react";
import { RiShieldUserLine } from "react-icons/ri";
import "./Otp.css";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Otp = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const location = useLocation();

  const emailFromState = location.state?.email || "";
  const otpExpireTime = location.state?.otp_expires || "";

  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: ["", "", "", ""],
  });

  // ===========================
  // OTP Input Change
  // ===========================
  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");

    if (value.length > 1) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;

    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && formData.otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ===========================
  // FRONTEND Verify OTP
  // ===========================
  const handleConfirmClick = async () => {
    const otpValue = formData.otp.join("");

    if (otpValue.length < 4) {
      await Swal.fire({
        icon: "error",
        title: "Enter your 4-digit OTP",
        timer: 1200,
        showConfirmButton: false,
      });
      return;
    }

    // 🔥 FRONTEND simulate success
    await Swal.fire({
      icon: "success",
      title: "OTP Verified Successfully",
      timer: 1200,
      showConfirmButton: false,
    });

    navigate("/comfirm", {
      state: { email: formData.email, otp: otpValue },
    });
  };

  // ===========================
  // FRONTEND Resend OTP
  // ===========================
  const handleResendClick = async () => {
    if (!canResend) return;

    // FRONTEND mock resend with fake expiry
    await Swal.fire({
      icon: "success",
      title: "OTP resent successfully!",
      timer: 1200,
      showConfirmButton: false,
    });

    const newExpire = Date.now() + 60000; // +60 seconds
    localStorage.setItem("otp_timer_end", newExpire);

    setTimeLeft(60);
    setCanResend(false);
  };

  // ===========================
  // TIMER + LOCALSTORAGE
  // ===========================
  useEffect(() => {
    const storedEnd = localStorage.getItem("otp_timer_end");

    if (!storedEnd) {
      setTimeLeft(0);
      setCanResend(true);
      return;
    }

    const remaining = Math.floor((parseInt(storedEnd) - Date.now()) / 1000);

    if (remaining > 0) {
      setTimeLeft(remaining);
      setCanResend(false);
    } else {
      setTimeLeft(0);
      setCanResend(true);
      localStorage.removeItem("otp_timer_end");
    }

    const interval = setInterval(() => {
      const end = localStorage.getItem("otp_timer_end");
      if (!end) return;

      const left = Math.floor((parseInt(end) - Date.now()) / 1000);

      if (left > 0) {
        setTimeLeft(left);
      } else {
        setTimeLeft(0);
        setCanResend(true);
        localStorage.removeItem("otp_timer_end");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [localStorage.getItem("otp_timer_end")]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const goToLogin = () => {
    navigate("/forget");
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "#e7e7e7" }}
    >
      <div className="container py-5" style={{ position: "fixed" }}>
        <div className="container-fluid d-flex justify-content-center align-items-center flex-column">
          <div className="otpbox">
            {/* Header */}
            <div className="text-center my-4">
              <div
                className="d-flex align-items-center justify-content-center voilet-color-bg rounded-circle mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <RiShieldUserLine color="white" size={30} />
              </div>
              <h3 className="text-center red-color-text">Verify OTP</h3>
              <p className="text-secondary fs-6 text-center">
                Enter the 4-digit code sent to your Email ID
              </p>
            </div>

            {/* OTP INPUT */}
            <form>
              <p className="form-label text-center fw-semibold">
                Enter verification code
              </p>

              <div className="text-center">
                {formData.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    className="otp-input ms-2"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    inputMode="numeric"
                  />
                ))}
              </div>

              <button
                type="button"
                className="text-center otp-btn voilet-color-bg text-white mt-4"
                onClick={handleConfirmClick}
              >
                Verify code
              </button>
            </form>

            {/* RESEND BUTTON */}
            <p className="text-secondary fs-6 text-center mt-4">
              Didn’t receive the code?{" "}
              <span
                onClick={handleResendClick}
                className={canResend ? "text-danger resend" : "text-muted"}
                style={{
                  cursor: canResend ? "pointer" : "not-allowed",
                }}
              >
                {canResend ? (
                  "Resend code"
                ) : (
                  <>
                    Resend in{" "}
                    <span
                      style={{
                        color: "#cf2030",
                        fontWeight: "600",
                      }}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </>
                )}
              </span>
            </p>

            {/* Back */}
            <p
              className="text-secondary fs-6 text-center mt-4"
              style={{ cursor: "pointer" }}
              onClick={goToLogin}
            >
              <MdOutlineKeyboardBackspace className="mb-1 me-1" />
              Back to Email ID
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
