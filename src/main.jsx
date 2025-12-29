import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./config.css";
import App from "./app/App.jsx";
import { registerSW } from "virtual:pwa-register";
import store from "./redux/store.jsx";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


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


const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
       

      <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
        </GoogleOAuthProvider>
      </StrictMode>
    </PersistGate>
  </Provider>
);
