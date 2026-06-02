const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const verificationCodes = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/send-code", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({
            success: false,
            message: "Email is required"
        });
    }

    const code = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    verificationCodes[email] = code;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verification Code",
            html: `
                <h2>Email Verification</h2>
                <p>Your verification code is:</p>
                <h1>${code}</h1>
            `
        });

        res.json({
            success: true,
            message: "Code sent successfully"
        });

    } catch (error) {
        console.error(error);

        res.json({
            success: false,
            message: "Failed to send email"
        });
    }
});

app.post("/verify-code", (req, res) => {
    const { email, code } = req.body;

    if (
        verificationCodes[email] &&
        verificationCodes[email] === code
    ) {
        delete verificationCodes[email];

        return res.json({
            success: true,
            message: "Login successful"
        });
    }

    res.json({
        success: false,
        message: "Invalid code"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
