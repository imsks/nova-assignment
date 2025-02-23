const supabase = require("../services/db")

exports.submitKyc = async (req, res) => {
    try {
        const userId = req.user.id
        const { full_name } = req.body

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const fileBuffer = req.file.buffer
        const originalName = req.file.originalname
        const mimeType = req.file.mimetype

        const filePath = `kyc-docs/${userId}/${Date.now()}-${originalName}`

        const { error: uploadError } = await supabase.storage
            .from("kyc-docs")
            .upload(filePath, fileBuffer, {
                contentType: mimeType
            })

        if (uploadError) {
            return res.status(400).json({ message: uploadError.message })
        }

        const { data: publicUrlData } = supabase.storage
            .from("kyc-docs")
            .getPublicUrl(filePath)

        const doc_url = publicUrlData.publicUrl

        const { error } = await supabase
            .from("kyc_submissions")
            .insert([{ user_id: userId, full_name, doc_url }])
            .single()

        if (error) {
            return res.status(400).json({ message: error.message })
        }

        return res
            .status(201)
            .json({ message: "KYC submitted", kyc: { status: "Pending" } })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.getUserKyc = async (req, res) => {
    try {
        const userId = req.user.id
        const { data, error } = await supabase
            .from("kyc_submissions")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

        if (error && error.code !== "PGRST116") {
            return res.status(400).json({ message: error.message })
        }

        return res.status(200).json({ kyc: data })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

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

exports.updateKycStatus = async (req, res) => {
    try {
        const { submissionId } = req.params
        const { status } = req.body

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

exports.getKpiData = async (req, res) => {
    try {
        const { data: totalUsers } = await supabase.from("users").select("*")

        const { data: approved } = await supabase
            .from("kyc_submissions")
            .select("*")
            .eq("status", "approved")

        const { data: rejected } = await supabase
            .from("kyc_submissions")
            .select("*")
            .eq("status", "rejected")

        const { data: pending } = await supabase
            .from("kyc_submissions")
            .select("*")
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
