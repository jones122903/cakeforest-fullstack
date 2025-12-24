import React from "react";
import toast from "react-hot-toast";
import "../../admin/utils/showToast.css";

export const showHotToast = (type = "success", message = "") => {
  const isSuccess = type === "success";

  toast.custom(
    (t) => (
      <div
        className={`re-bk-toast-wrapper ${t.visible ? "slide-in" : "slide-out"
          }`}
        style={{
          zIndex: 99999999,
          backgroundColor: isSuccess ? "#0e4d65" : "#dc2626", // ✅ HERE
        }}
      >
        <div className="re-bk-toast">
          {isSuccess ? (
            <img
              src="https://bkassets.bakingo.com/bakingo-ssr/static/media/check.adfc0424.svg"
              alt="success"
            />
          ) : (
            <div className="re-bk-error-icon-circle">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: '12px', height: '12px' }}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          )}

          <span className="re-bk-text-toast">{message}</span>
        </div>

        <div
          className="re-bk-progress"
          style={{ backgroundColor: "#ffffff" }} // ✅ white progress
        />
      </div>
    ),
    {
      duration: 2000,
      position: "top-right",
    }
  );
};
