import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage";
import Protected from "./components/Protected";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Questions from "./pages/questions/Questions";
import Body from "./pages/Body";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import VerifyOTP from "./pages/VerifyOTP";

function App() {
  const clientId = import.meta.env.VITE_CLIENT_ID;

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="/" element={<Protected children={<Body />} />} />
              <Route path="/questions" element={<Questions />} />
            </Route>
            <Route path="/verify" element={<VerifyOTP />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage/>} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false}/>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
