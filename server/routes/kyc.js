// server/routes/kyc.js
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const {
    submitKyc,
    getUserKyc,
    getAllKyc,
    updateKycStatus,
    getKpiData
} = require("../controllers/kycController")

// User endpoints
router.post("/submit", authMiddleware(["user"]), submitKyc)
router.get("/user", authMiddleware(["user"]), getUserKyc)

// Admin endpoints
router.get("/all", authMiddleware(["admin"]), getAllKyc)
router.put("/:submissionId", authMiddleware(["admin"]), updateKycStatus)
router.get("/kpi", authMiddleware(["admin"]), getKpiData)

module.exports = router
