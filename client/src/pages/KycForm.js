// client/src/pages/KycForm.js

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function KycForm() {
    const [fullName, setFullName] = useState("")
    const [docUrl, setDocUrl] = useState("")
    const [kycStatus, setKycStatus] = useState(null)

    const [message, setMessage] = useState("") // success or error message
    const [isError, setIsError] = useState(false) // track whether message is error

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    // Redirect if not authenticated
    useEffect(() => {
        if (!token) {
            navigate("/")
        }
    }, [token, navigate])

    // Fetch existing KYC status
    useEffect(() => {
        const fetchKycStatus = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/kyc/user", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await res.json()

                if (res.ok && data.kyc) {
                    setKycStatus(data.kyc.status)
                }
            } catch (err) {
                console.error(err)
            }
        }

        fetchKycStatus()
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:4000/api/kyc/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ full_name: fullName, doc_url: docUrl })
            })
            const data = await res.json()

            if (res.ok) {
                setMessage("KYC submitted successfully!")
                setIsError(false)
                setKycStatus(data.kyc.status)
            } else {
                setMessage(data.message || "Error submitting KYC.")
                setIsError(true)
            }
        } catch (err) {
            console.error(err)
            setMessage("An error occurred while submitting KYC.")
            setIsError(true)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='max-w-md w-full bg-white p-8 rounded-md shadow-md'>
                <h2 className='text-2xl font-semibold text-center mb-6'>
                    KYC Form
                </h2>

                {/* If we have a KYC status, show it in a small info box */}
                {kycStatus && (
                    <div className='mb-4 p-3 rounded bg-blue-100 text-blue-700'>
                        Your current KYC status: <strong>{kycStatus}</strong>
                    </div>
                )}

                {/* Success/Error Messages */}
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
                    {/* Full Name Field */}
                    <div className='mb-4'>
                        <label
                            htmlFor='fullName'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Full Name
                        </label>
                        <input
                            id='fullName'
                            type='text'
                            placeholder='Full Name'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 
                         rounded-md focus:outline-none focus:ring-1 
                         focus:ring-blue-500'
                            required
                        />
                    </div>

                    {/* Document URL Field */}
                    <div className='mb-4'>
                        <label
                            htmlFor='docUrl'
                            className='block text-sm font-medium text-gray-700 mb-1'>
                            Document URL
                        </label>
                        <input
                            id='docUrl'
                            type='text'
                            placeholder='Document URL'
                            value={docUrl}
                            onChange={(e) => setDocUrl(e.target.value)}
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
                        Submit KYC
                    </button>
                </form>
            </div>
        </div>
    )
}

export default KycForm
