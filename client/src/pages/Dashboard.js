// client/src/pages/Dashboard.js
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard() {
    const [submissions, setSubmissions] = useState([])
    const [kpi, setKpi] = useState({})
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const navigate = useNavigate()

    useEffect(() => {
        if (!token || role !== "admin") {
            navigate("/")
            return
        }
        fetchKycSubmissions()
        fetchKpi()
    }, [token, role, navigate])

    const fetchKycSubmissions = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/kyc/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (res.ok) {
                setSubmissions(data.submissions)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const fetchKpi = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/kyc/kpi", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (res.ok) {
                setKpi(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:4000/api/kyc/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })
            const data = await res.json()
            if (res.ok) {
                // Refresh the list
                fetchKycSubmissions()
                fetchKpi()
            } else {
                alert(data.message)
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <h3>KPI</h3>
            <p>Total Users: {kpi.totalUsers}</p>
            <p>Approved: {kpi.approved}</p>
            <p>Rejected: {kpi.rejected}</p>
            <p>Pending: {kpi.pending}</p>

            <h3>KYC Submissions</h3>
            <table border='1'>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Document</th>
                        <th>Status</th>
                        <th>Approve/Reject</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((sub) => (
                        <tr key={sub.id}>
                            <td>{sub.users.email}</td>
                            <td>{sub.full_name}</td>
                            <td>
                                <a
                                    href={sub.doc_url}
                                    target='_blank'
                                    rel='noreferrer'>
                                    View Doc
                                </a>
                            </td>
                            <td>{sub.status}</td>
                            <td>
                                {sub.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    sub.id,
                                                    "approved"
                                                )
                                            }>
                                            Approve
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleStatusChange(
                                                    sub.id,
                                                    "rejected"
                                                )
                                            }>
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard
