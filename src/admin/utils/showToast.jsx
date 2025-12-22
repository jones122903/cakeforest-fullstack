import React from "react";
import toast from "react-hot-toast";
import "../../admin/utils/showToast.css";

export const showHotToast = (type = "success", message = "") => {
  const isSuccess = type === "success";

  toast.custom(
    (t) => (
      <div
        className={`re-bk-toast-wrapper ${
          t.visible ? "slide-in" : "slide-out"
        }`}
        style={{
          zIndex: 99999999,
          backgroundColor: isSuccess ? "#0e4d65" : "#dc2626", // ✅ HERE
        }}
      >
        <div className="re-bk-toast">
          <div className="re-bk-toast">
            {isSuccess ? (
              <img
                src="https://bkassets.bakingo.com/bakingo-ssr/static/media/check.adfc0424.svg"
                alt="success"
              />
            ) : (
              <span style={{ fontWeight: "bold", fontSize: "16px", color: "white" }}>✕</span>
            )}

            <span className="re-bk-text-toast">{message}</span>
          </div>
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
