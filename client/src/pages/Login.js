import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import useAPI from "../hooks/useAPI"

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)
    const navigate = useNavigate()

    const { loginUser } = useAPI()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await loginUser(formData)

            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.role)

            setMessage("Login successful!")
            setIsError(false)

            if (data.role === "admin") {
                navigate("/dashboard")
            } else {
                navigate("/kyc")
            }
        } catch (err) {
            console.error(err)
            setMessage(err.message)
            setIsError(true)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='max-w-md w-full bg-white p-8 rounded-md shadow-md'>
                <h2 className='text-2xl font-semibold text-center mb-6'>
                    Login
                </h2>

                {message && (
                    <div
                        className={`mb-4 p-3 rounded ${
                            isError
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                        }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Email
                        </label>
                        <input
                            type='email'
                            name='email'
                            id='email'
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 
                         rounded-md focus:outline-none focus:ring-1 
                         focus:ring-blue-500'
                            required
                        />
                    </div>

                    <div className='mb-4'>
                        <label
                            htmlFor='password'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Password
                        </label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-gray-300 
                         rounded-md focus:outline-none focus:ring-1
                         focus:ring-blue-500'
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        className='w-full py-2 px-4 bg-blue-600 text-white 
                       font-semibold rounded-md hover:bg-blue-700 
                       focus:outline-none focus:bg-blue-700'>
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
