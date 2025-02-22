// server/controllers/authController.js
const supabase = require("../services/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single()

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insert new user
        const { data, error } = await supabase
            .from("users")
            .insert([{ email, password: hashedPassword, role }])
            .single()

        if (error) {
            return res.status(400).json({ message: error.message })
        }

        return res
            .status(201)
            .json({ message: "User registered successfully", user: data })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check user existence
        const { data: user } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single()

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" })
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" })
        }

        // Create JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        return res.status(200).json({ token, role: user.role })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
