const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Subscribe = require("../models/Subscribe");

router.post(
    "/subscribe",
    [body("email", "Enter a valid email!").isEmail()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ success: false, error: errors });
            return;
        }

        try {
            const { email } = req.body;
            const isPresent = await Subscribe.findOne({ email: email });

            if (isPresent) {
                res.status(200).send({
                    success: true,
                    data: "Already subscribed !",
                });
                return;
            } else {
                await Subscribe.create({ email: email });
                res.status(200).send({
                    success: true,
                    data: "Subscribed successfully",
                });
            }
        } catch (err) {
            res.status(500).send({
                success: false,
                data: "Something went wrong !",
            });
        }
    }
);

module.exports = router;
