// client/src/pages/KycForm.js
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function KycForm() {
    const [fullName, setFullName] = useState("")
    const [docUrl, setDocUrl] = useState("")
    const [kycStatus, setKycStatus] = useState(null)
    const navigate = useNavigate()

    const token = localStorage.getItem("token")

    useEffect(() => {
        // fetch existing KYC status
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
            // For the docUrl, you’d typically upload the file to Supabase Storage
            // and then get back a public URL or signed URL.

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
                alert("KYC submitted successfully!")
                setKycStatus(data.kyc.status)
            } else {
                alert(data.message)
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (!token) {
        navigate("/")
    }

    return (
        <div>
            <h2>KYC Form</h2>
            {kycStatus && <p>Your current KYC status: {kycStatus}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Full Name'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <input
                    type='text'
                    placeholder='Document URL'
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                />
                <button type='submit'>Submit KYC</button>
            </form>
        </div>
    )
}

export default KycForm
