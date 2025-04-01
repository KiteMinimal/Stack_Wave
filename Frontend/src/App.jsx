import { useState } from 'react'
import AuthPage from './pages/auth/AuthPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Protected from './components/Protected'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Protected children={<Home/>} /> } />
        <Route path='/auth' element={<AuthPage/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
