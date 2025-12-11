import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./config.css";
import App from "./app/App.jsx";
import { registerSW } from "virtual:pwa-register";
import store from "./redux/store.jsx";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";


// Register service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload to update?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  </Provider>
);
