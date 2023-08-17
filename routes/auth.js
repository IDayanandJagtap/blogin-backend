const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../Middleware/fetchUser");
const dotenv = require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//! 1. Signup the user :
router.post(
    "/signup",
    [
        body("email", "Enter a valid email!").isEmail(),
        body("password", "Password should contain min 5 chars").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ success: false, error: errors });
            return;
        }

        try {
            // Check if the user is already present
            const { name, email, password } = req.body;
            const oldUser = await User.findOne({ email: email });
            if (oldUser) {
                res.status(400).send({
                    success: false,
                    error: "User with this email is already present",
                });
                return;
            }
            // Create a new user
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(password, salt);

            const user = await User.create({
                name: name,
                email: email,
                password: hashedPass,
            });

            const tokenData = {
                user: {
                    id: user.id,
                },
            };

            const token = jwt.sign(tokenData, JWT_SECRET_KEY);
            res.status(200).send({ success: true, message: token });
        } catch (err) {
            res.status(500).send({
                success: false,
                error: "Something went wrong!",
            });
        }
    }
);

router.post(
    "/login",
    [
        body("email", "Enter a valid email ").isEmail(),
        body("password", "Password should contain min 5 chars").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ success: false, error: errors });
            return;
        }

        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) {
                res.status(400).send({
                    success: false,
                    error: "Invalid credentails",
                });
                return;
            }

            //compare password ;
            const isPassword = await bcrypt.compare(password, user.password);
            if (!isPassword) {
                res.status(400).send({
                    success: false,
                    error: "Invalid credentails",
                });
                return;
            }

            const tokenData = {
                user: {
                    id: user.id,
                },
            };

            const jsonToken = jwt.sign(tokenData, JWT_SECRET_KEY);
            res.status(200).send({ success: true, message: jsonToken });
        } catch (err) {
            res.status(500).send({
                success: false,
                error: "Something went wrong!",
            });
        }
    }
);

//! 3. Get user details
router.get("/getuser", fetchUser, async (req, res) => {
    if (!req.user) {
        res.status(400).send({
            success: false,
            error: "User not authenticated",
        });
        return;
    }
    try {
        const userId = req.user.id;

        const user = await User.findOne({ _id: userId }).select("-password");
        res.status(200).send({ success: true, message: user });
    } catch (err) {
        res.status(500).send({
            success: false,
            error: "Something went wrong!",
        });
    }
});

module.exports = router;
