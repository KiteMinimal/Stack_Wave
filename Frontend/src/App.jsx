import AuthPage from './pages/auth/AuthPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Protected from './components/Protected'
import { ToastContainer } from 'react-toastify';
import VerifyOTP from './pages/verification/VerifyOTP'
import { GoogleOAuthProvider } from "@react-oauth/google"
import Questions from './pages/questions/Questions';
import Body from './pages/body/Body';
import Room from './pages/room/Room';

function App() {

  const clientId = import.meta.env.VITE_CLIENT_ID;

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home/> } >
          <Route path='/' element={ <Protected children={<Body/>} /> } />
          <Route path='/questions' element={ <Questions/> } />
          <Route path='/rooms' element={<Room/>} />
        </Route>
        <Route path='/auth' element={<GoogleOAuthProvider clientId={clientId}> <AuthPage/> </GoogleOAuthProvider>} />
        <Route path='/verify' element={<VerifyOTP/>} />
      </Routes>
    </BrowserRouter>
    <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
