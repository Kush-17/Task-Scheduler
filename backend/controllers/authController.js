const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const zod = require('zod');

// Register a new User
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // zod check
    const registerSchema = zod.object({
        name: zod.string().min(3, "Name must be at least 3 characters long."),
        email: zod.string().email("Invalid email address."),
        password: zod.string().min(6, "Password must be at least 6 characters long."),
    });

    const validation = registerSchema.safeParse({ name, email, password });

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            error: validation.error.errors.map(err => err.message)
        });
    }

    try {

        // Check if the user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User with this email already exists."
            });
        }

        const user = await User.create({
            name,
            email,
            password
        });
        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Login the User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // zod check
    const loginSchema = zod.object({
        email: zod.string().email("Invalid email address."),
        password: zod.string().min(6, "Password must be at least 6 characters long."),
    });

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            error: validation.error.errors.map(err => err.message)
        });
    }

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: "Please provide email and password"
        });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({
                success: false,
                error: "Invalid Credentials"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        });

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
