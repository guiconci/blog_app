const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

// Tighter limit on logins to block brute-force:
const loginLimiter = rateLimit({
    windowMs: 15 * 60_000,  // 15 minutes
    max: 10,           // 10 attempts per IP
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, /*next*/) => {
        // Error message
        res.status(429).json({ error: "Too many login attempts. Please wait 15 minutes." });
    }
});

// Simulated users
const USERS = {
    [process.env.ADMIN_USERNAME.toLowerCase()]: {
        passwordHash: process.env.ADMIN_PASSWORD_HASH,
        user_id: 1,
        role: "admin",
    },
    guest: {
        passwordHash: null, // No password needed
        user_id: 2,
        role: "guest",
    },
};



//Setup Route
router.post('/api/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = USERS[username.toLowerCase()];
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role === "guest") {
        // Allow guest login with no password
        const token = jwt.sign(
            { userId: user.user_id, username, role: "guest" },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ username, role: "guest", token });
    }

    // Admin user: check password
    const match = bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { userId: user.user_id, username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '3h' } // expires in 1 hour
    );
    res.json({ username, role: user.role, token });
});


module.exports = router;