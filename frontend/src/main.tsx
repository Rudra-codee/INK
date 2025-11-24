import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Root = () => {
  if (!googleClientId) {
    console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google Sign-In is disabled.");
    return <App />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
