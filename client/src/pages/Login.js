// client/src/pages/Login.js
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [message, setMessage] = useState("")
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()

            if (res.ok) {
                // Save token & role in localStorage
                localStorage.setItem("token", data.token)
                localStorage.setItem("role", data.role)
                setMessage("Login successful!")
                // Navigate based on role
                if (data.role === "admin") {
                    navigate("/dashboard")
                } else {
                    navigate("/kyc")
                }
            } else {
                setMessage(data.message)
            }
        } catch (err) {
            console.error(err)
            setMessage("Error occurred during login.")
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type='submit'>Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Login
