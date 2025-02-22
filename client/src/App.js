// client/src/App.js
import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import KycForm from "./pages/KycForm"
import Dashboard from "./pages/Dashboard"

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/kyc' element={<KycForm />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </Router>
    )
}

export default App
