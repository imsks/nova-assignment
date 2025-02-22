// server/index.js
const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const kycRoutes = require("./routes/kyc")

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/kyc", kycRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
