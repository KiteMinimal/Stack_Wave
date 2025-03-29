import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/about",
    element: <h1> Hey this is about page </h1>
  }
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={appRouter}/>
)
