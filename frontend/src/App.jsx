import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext'

import Landing from "./pages/Landing.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard"
import Simulador from "./pages/Simulador"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulador" element={<Simulador />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App