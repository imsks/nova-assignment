const express = require("express")
const router = express.Router()
const multer = require("multer")
const authMiddleware = require("../middleware/authMiddleware")
const {
    submitKyc,
    getUserKyc,
    getAllKyc,
    updateKycStatus,
    getKpiData
} = require("../controllers/kycController")

const upload = multer({ storage: multer.memoryStorage() })

router.post(
    "/submit",
    authMiddleware(["user"]),
    upload.single("document"),
    submitKyc
)
router.get("/user", authMiddleware(["user"]), getUserKyc)

router.get("/all", authMiddleware(["admin"]), getAllKyc)
router.put("/:submissionId", authMiddleware(["admin"]), updateKycStatus)
router.get("/kpi", authMiddleware(["admin"]), getKpiData)

module.exports = router
