// client/src/pages/Dashboard.js
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAPI from "../hooks/useAPI"

function Dashboard() {
    const [submissions, setSubmissions] = useState([])
    const [kpi, setKpi] = useState({})

    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    const navigate = useNavigate()

    // Destructure custom hook methods
    const { getKycSubmissions, getKpi, updateKycStatus } = useAPI()

    useEffect(() => {
        if (!token || role !== "admin") {
            navigate("/")
            return
        }
        fetchData()
        // eslint-disable-next-line
    }, [token, role])

    const fetchData = async () => {
        try {
            const submissionsData = await getKycSubmissions(token)
            const kpiData = await getKpi(token)
            setSubmissions(submissionsData)
            setKpi(kpiData)
        } catch (err) {
            console.error(err)
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateKycStatus(token, id, status)
            // Refresh the data
            fetchData()
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
    }

    return (
        <div className='flex items-start justify-center min-h-screen bg-gray-100 p-4'>
            <div className='w-full max-w-5xl bg-white p-8 rounded-md shadow-md'>
                <h2 className='text-2xl font-semibold text-center mb-6'>
                    Admin Dashboard
                </h2>

                {/* KPI Section */}
                <h3 className='text-lg font-medium mb-2'>KPI</h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                    {/* Total Users */}
                    <div className='p-4 bg-blue-100 text-blue-700 rounded-md text-center'>
                        <p className='font-semibold'>Total Users</p>
                        <p className='text-2xl font-bold'>
                            {kpi.totalUsers ?? 0}
                        </p>
                    </div>

                    {/* Approved */}
                    <div className='p-4 bg-green-100 text-green-700 rounded-md text-center'>
                        <p className='font-semibold'>Approved</p>
                        <p className='text-2xl font-bold'>
                            {kpi.approved ?? 0}
                        </p>
                    </div>

                    {/* Rejected */}
                    <div className='p-4 bg-red-100 text-red-700 rounded-md text-center'>
                        <p className='font-semibold'>Rejected</p>
                        <p className='text-2xl font-bold'>
                            {kpi.rejected ?? 0}
                        </p>
                    </div>

                    {/* Pending */}
                    <div className='p-4 bg-yellow-100 text-yellow-700 rounded-md text-center'>
                        <p className='font-semibold'>Pending</p>
                        <p className='text-2xl font-bold'>{kpi.pending ?? 0}</p>
                    </div>
                </div>

                {/* Submissions Table */}
                <h3 className='text-lg font-medium mb-4'>KYC Submissions</h3>
                <div className='overflow-x-auto'>
                    <table className='min-w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-200'>
                                <th className='py-2 px-4 border-b border-gray-300 text-left'>
                                    Email
                                </th>
                                <th className='py-2 px-4 border-b border-gray-300 text-left'>
                                    Full Name
                                </th>
                                <th className='py-2 px-4 border-b border-gray-300 text-left'>
                                    Document
                                </th>
                                <th className='py-2 px-4 border-b border-gray-300 text-left'>
                                    Status
                                </th>
                                <th className='py-2 px-4 border-b border-gray-300 text-left'>
                                    Approve/Reject
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id} className='hover:bg-gray-50'>
                                    <td className='py-2 px-4 border-b border-gray-200'>
                                        {sub.users.email}
                                    </td>
                                    <td className='py-2 px-4 border-b border-gray-200'>
                                        {sub.full_name}
                                    </td>
                                    <td className='py-2 px-4 border-b border-gray-200'>
                                        <a
                                            href={sub.doc_url}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='text-blue-600 hover:underline'>
                                            View Doc
                                        </a>
                                    </td>
                                    <td className='py-2 px-4 border-b border-gray-200 capitalize'>
                                        {sub.status}
                                    </td>
                                    <td className='py-2 px-4 border-b border-gray-200'>
                                        {sub.status === "pending" ? (
                                            <div className='space-x-2'>
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            sub.id,
                                                            "approved"
                                                        )
                                                    }
                                                    className='px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700'>
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            sub.id,
                                                            "rejected"
                                                        )
                                                    }
                                                    className='px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'>
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className='text-gray-500'>
                                                N/A
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td
                                        className='py-4 px-4 border-b border-gray-200 text-center'
                                        colSpan='5'>
                                        No submissions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
