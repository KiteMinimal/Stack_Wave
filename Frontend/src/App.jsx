import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import VerifyOTP from "./pages/VerifyOTP";
import LandingPage from "./pages/LandingPage";
import { useSelector } from "react-redux";
import BodyLayout from "./pages/BodyLayout";
import Dashboard from "./pages/Dashboard";
import QuestionPage from "./pages/QuestionPage";
import AskPage from "./pages/AskPage";
import QuestionDetailsPage from "./pages/QuestionDetailsPage";
import RoomsPage from "./pages/RoomsPage";
import PageNotFound from "./components/PageNotFound";

function App() {

  const clientId = import.meta.env.VITE_CLIENT_ID;
  const { token } = useSelector(state => state.user);
  console.log(token);
  
  const isUserAuthenticated = !!token;

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage/> } />
            <Route path="/verify" element={<VerifyOTP />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route element={<BodyLayout isAuthenticated={isUserAuthenticated} />} >
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/questions" element={<QuestionPage/>} />
              <Route path="/ask" element={<AskPage />} />
              <Route path="/question/:id" element={<QuestionDetailsPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
            </Route>
          <Route path="*" element={<PageNotFound/>} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={false}/>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
