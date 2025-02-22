// client/src/hooks/useAPI.js
import { useState } from "react"

export default function useAPI() {
    const baseURL = "http://localhost:4000/api" // adjust if needed

    /**
     * LOGIN
     * @param {Object} formData { email, password }
     */
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
        return data // { token, role }
    }

    /**
     * REGISTER
     * @param {Object} formData { email, password, role }
     */
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

    /**
     * GET KYC STATUS
     * @param {string} token
     * returns { id, user_id, status, etc. } or null
     */
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
        return data.kyc // kyc object or null
    }

    /**
     * SUBMIT KYC
     * @param {string} token
     * @param {Object} fields { fullName, docUrl }
     */
    const submitKyc = async (token, { fullName, docUrl }) => {
        const res = await fetch(`${baseURL}/kyc/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ full_name: fullName, doc_url: docUrl })
        })
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "KYC submission failed")
        }
        return data // { kyc: { ... }, message, etc. }
    }

    /**
     * GET ALL KYC SUBMISSIONS (Admin)
     * @param {string} token
     * returns array of submissions
     */
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
        return data.submissions // array
    }

    /**
     * GET KPI DATA (Admin)
     * @param {string} token
     * returns { totalUsers, approved, rejected, pending }
     */
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
        return data // { totalUsers, approved, rejected, pending }
    }

    /**
     * UPDATE KYC STATUS (Admin)
     * @param {string} token
     * @param {string} submissionId
     * @param {string} status ( "approved" | "rejected" )
     */
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
