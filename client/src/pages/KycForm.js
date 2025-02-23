import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAPI from "../hooks/useAPI"

function KycForm() {
    const [fullName, setFullName] = useState("")
    const [docUrl, setDocUrl] = useState("")
    const [kycStatus, setKycStatus] = useState(null)
    const [message, setMessage] = useState("")
    const [isError, setIsError] = useState(false)

    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const { getKycStatus, submitKyc } = useAPI()

    useEffect(() => {
        if (!token) {
            navigate("/")
        }
    }, [token, navigate])

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getKycStatus(token)
                if (data) {
                    setKycStatus(data.status)
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchStatus()
    }, [token, getKycStatus])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const result = await submitKyc(token, {
                fullName,
                docUrl
            })
            setKycStatus(result.kyc.status)
            setMessage("KYC submitted successfully!")
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
                    KYC Form
                </h2>

                {kycStatus && (
                    <div className='mb-4 p-3 rounded bg-blue-100 text-blue-700'>
                        Your current KYC status: <strong>{kycStatus}</strong>
                    </div>
                )}

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
