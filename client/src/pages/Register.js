// client/src/pages/Register.js
import React, { useState } from "react"

function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user"
    })
    const [message, setMessage] = useState("")

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                setMessage("Registration successful! You can now login.")
            } else {
                setMessage(data.message)
            }
        } catch (err) {
            console.error(err)
            setMessage("Error occurred during registration.")
        }
    }

    return (
        <div>
            <h2>Register</h2>
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
                <select
                    name='role'
                    value={formData.role}
                    onChange={handleChange}>
                    <option value='user'>User</option>
                    <option value='admin'>Admin</option>
                </select>
                <button type='submit'>Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Register
