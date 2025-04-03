import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/userSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = () => {
    if (email.length <= 0 && password.length <= 0) return;
    setError("");
    axios
      .post(BASE_URL + "/api/auth/login", { email, password })
      .then((res) => {
        let { user, token, message } = res?.data;
        toast.success(message);
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((err) => {
        let { message, errors } = err?.response?.data;
        if (message) {
          toast.error(message);
          setError(message);
        } else {
          toast.error(errors[0].msg);
          setError(errors[0].msg);
        }
      });
  };

  const handleRegister = () => {
    if (username.length <= 0 && email.length <= 0 && password.length <= 0)
      return;
    setError("");
    axios
      .post(BASE_URL + "/api/auth/signUp", { username, email, password })
      .then((res) => {
        let { user, token, message } = res?.data;
        toast.success(message);
        localStorage.setItem("token", token);
        navigate("/verify");
      })
      .catch((err) => {
        let { message, errors } = err?.response?.data;
        if (message) {
          toast.error(message);
          setError(message);
        } else {
          setError(errors[0].msg);
        }
      });
  };

  const handleGoogleLogin = (credential) => {
    axios
      .post(BASE_URL + "/api/auth/google-login", { credential })
      .then((res) => {
        const {token,user,message} = res.data;
        localStorage.setItem("token",token)
        dispatch(addUser({user,token}))
        toast(message)
        console.log(res);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const googleLogin = () => <GoogleLogin
  // onSuccess={(response) => {
  //   console.log("Google Response:", response);
  //   handleGoogleLogin(response.credential);
  // }}
  // onError={() => toast("Google Login Failed...!")}
  // />

  return (
    <main className="w-full h-screen flex items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-md bg-white p-6 sm:p-8 shadow-lg rounded-lg">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          {isLogin ? "Login to account" : "Register"}
        </h2>

        <div className="flex items-center justify-center flex-col gap-5 mt-10">
          {!isLogin && (
            <div className="input-group w-full flex flex-col">
              <label className="input validator w-full">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>
                <input
                  type="input"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  pattern="[A-Za-z][A-Za-z0-9\-]*"
                  minLength="3"
                  maxLength="30"
                  title="Only letters, numbers or dash"
                />
              </label>
            </div>
          )}

          <div className="input-group w-full flex flex-col">
            <label className="input validator w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </g>
              </svg>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                type="email"
                placeholder="mail@site.com"
                required
              />
            </label>
            <div className="validator-hint hidden">
              Enter valid email address
            </div>
          </div>

          <div className="input-group w-full flex flex-col">
            <label className="input validator w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                  <circle
                    cx="16.5"
                    cy="7.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                </g>
              </svg>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="Password"
                minLength="6"
                pattern="([a-z])).{6}"
                title="Must be more than 6 characters, including number, lowercase letter"
              />
            </label>
            <p className="validator-hint hidden">
              Must be more than 8 characters, including
              <br />
              At least one number
              <br />
              At least one lowercase letter
            </p>
          </div>

          <div className="w-full">
            <div className="font-semibold text-left flex gap-2">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <p
                onClick={() => setIsLogin(!isLogin)}
                className="text-fuchsia-700"
              >
                {isLogin ? "Register" : "Login"}
              </p>
            </div>
          </div>

          {isLogin ? (
            <button
              onClick={handleLogin}
              className="cursor-pointer w-full bg-fuchsia-600 hover:bg-fuchsia-700 transition text-white px-8 py-2 rounded font-medium mt-4"
            >
              login
            </button>
          ) : (
            <button
              onClick={handleRegister}
              className="cursor-pointer w-full bg-fuchsia-600 hover:bg-fuchsia-700 transition text-white px-8 py-2 rounded font-medium mt-4"
            >
              Register
            </button>
          )}

          <div className="w-full flex items-center justify-center gap-5 mt-5">
            <div className="btn w-fit bg-black text-white border-black">
              <svg
                aria-label="GitHub logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                ></path>
              </svg>
              Github
            </div>

            <div className="w-fit font-semibold">
              <GoogleLogin
                onSuccess={(response) => {
                  console.log("Google Response:", response);
                  handleGoogleLogin(response.credential);
                }}
                onError={() => toast("Google Login Failed...!")}
              />
            </div>
            {/* <div onClick={googleLogin} className="btn w-fit bg-white text-black border-[#e5e5e5]">
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Google
            </div> */}
          </div>
        </div>

        {error && (
          <div className="text-red-500 font-medium text-center mt-3">
            {error}
          </div>
        )}
      </section>
    </main>
  );
};

export default Login;
