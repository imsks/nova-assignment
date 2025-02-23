import React, { useState } from "react"
import useAPI from "../hooks/useAPI"

function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user"
    })
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)

    const { registerUser } = useAPI()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleRoleChange = (role) => {
        setFormData((prev) => ({ ...prev, role }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await registerUser(formData)

            setMessage("Registration successful! You can now login.")
            setIsError(false)
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
                    Register
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

                    <div className='mb-4'>
                        <span className='block text-sm font-medium text-gray-700 mb-1'>
                            Select Role
                        </span>
                        <div className='flex space-x-2'>
                            <button
                                type='button'
                                onClick={() => handleRoleChange("user")}
                                className={`px-4 py-2 border rounded-md ${
                                    formData.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700"
                                }`}>
                                User
                            </button>
                            <button
                                type='button'
                                onClick={() => handleRoleChange("admin")}
                                className={`px-4 py-2 border rounded-md ${
                                    formData.role === "admin"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700"
                                }`}>
                                Admin
                            </button>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='w-full py-2 px-4 bg-blue-600 text-white 
                       font-semibold rounded-md hover:bg-blue-700 
                       focus:outline-none focus:bg-blue-700'>
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
