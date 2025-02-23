export default function useAPI() {
    const baseURL = "http://localhost:4000/api"

    const loginUser = async (formData) => {
        const res = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "Login failed")
        }
        return data
    }

    const registerUser = async (formData) => {
        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "Registration failed")
        }
        return data
    }

    const getKycStatus = async (token) => {
        const res = await fetch(`${baseURL}/kyc/user`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "Could not fetch KYC status")
        }
        return data.kyc
    }

    const submitKyc = async (token, formData) => {
        const res = await fetch("http://localhost:4000/api/kyc/submit", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "KYC submission failed")
        }

        return data
    }

    const getKycSubmissions = async (token) => {
        const res = await fetch(`${baseURL}/kyc/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "Could not fetch KYC submissions")
        }
        return data.submissions
    }

    const getKpi = async (token) => {
        const res = await fetch(`${baseURL}/kyc/kpi`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "Could not fetch KPI data")
        }
        return data
    }

    const updateKycStatus = async (token, submissionId, status) => {
        const res = await fetch(`${baseURL}/kyc/${submissionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "Could not update KYC status")
        }
        return data
    }

    return {
        loginUser,
        registerUser,
        getKycStatus,
        submitKyc,
        getKycSubmissions,
        getKpi,
        updateKycStatus
    }
}
