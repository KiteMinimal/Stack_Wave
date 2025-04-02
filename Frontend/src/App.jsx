import { useState } from 'react'
import AuthPage from './pages/auth/AuthPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Protected from './components/Protected'
import { ToastContainer } from 'react-toastify';
import VerifyOTP from './pages/verification/VerifyOTP'

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Protected children={<Home/>} /> } />
        <Route path='/auth' element={<AuthPage/>} />
        <Route path='/verify' element={<VerifyOTP/>} />
      </Routes>
    </BrowserRouter>
    <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
