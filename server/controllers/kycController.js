// server/controllers/kycController.js
const supabase = require("../services/db")

// Submit KYC by user
exports.submitKyc = async (req, res) => {
    try {
        // `req.user.id` is set by authMiddleware once the user is logged in
        const userId = req.user.id
        const { full_name } = req.body

        // File upload
        // If you attached a file in the request (e.g., via form-data),
        // you would have something like `req.files.document`.
        // For brevity, let's assume front-end uses base64 or direct upload to Supabase
        // Storage and passes doc_url to the backend.

        const { doc_url } = req.body // doc_url from front-end after uploading

        // Insert/Update kyc_submissions
        const { data, error } = await supabase
            .from("kyc_submissions")
            .insert([{ user_id: userId, full_name, doc_url }])
            .single()

        if (error) {
            return res.status(400).json({ message: error.message })
        }

        return res.status(201).json({ message: "KYC submitted", kyc: data })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// Get KYC status by user
exports.getUserKyc = async (req, res) => {
    try {
        const userId = req.user.id
        const { data, error } = await supabase
            .from("kyc_submissions")
            .select("*")
            .eq("user_id", userId)
            .single()

        if (error && error.code !== "PGRST116") {
            return res.status(400).json({ message: error.message })
        }

        // If user has no submission, data will be null
        return res.status(200).json({ kyc: data })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// Admin: get all KYC submissions
exports.getAllKyc = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("kyc_submissions")
            .select("*, users!inner(email, role)")

        if (error) {
            return res.status(400).json({ message: error.message })
        }

        return res.status(200).json({ submissions: data })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// Admin: Approve/Reject KYC
exports.updateKycStatus = async (req, res) => {
    try {
        const { submissionId } = req.params
        const { status } = req.body // 'approved' or 'rejected'

        const { data, error } = await supabase
            .from("kyc_submissions")
            .update({ status })
            .eq("id", submissionId)
            .single()

        if (error) {
            return res.status(400).json({ message: error.message })
        }

        return res
            .status(200)
            .json({ message: "KYC status updated", kyc: data })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

// Admin: Basic KPIs
exports.getKpiData = async (req, res) => {
    try {
        // total users
        const { data: totalUsers } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })

        // For KYC statuses
        const { data: approved } = await supabase
            .from("kyc_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "approved")

        const { data: rejected } = await supabase
            .from("kyc_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "rejected")

        const { data: pending } = await supabase
            .from("kyc_submissions")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending")

        res.status(200).json({
            totalUsers: totalUsers?.length ?? 0,
            approved: approved?.length ?? 0,
            rejected: rejected?.length ?? 0,
            pending: pending?.length ?? 0
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
