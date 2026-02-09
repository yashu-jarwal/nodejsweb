const express = require('express');
const cron = require('node-cron');
const fs = require('fs');
const router = express.Router();
const nodemailer = require('nodemailer');

/**
 * @swagger
 * /Schedule-task:
 *   get:
 *     summary: Check if scheduled cron task is running
 *     responses:
 *       200:
 *         description: Cron task status message
 */

router.get('/Schedule-task', (req, res) => {
    const sender_email = "yashujrwl@gmail.com"
    cron.schedule('* * * * *', async () => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender_email,
                pass: "fbfr amss cqke rbyf"
            }
        });
        const mailbody = {
            from: 'yashujrwl@gmail.com',
            to: "yashu.jarwal@gmail.com", // 📌 Replace with your recipient
            subject: "⏰ Scheduled Email",
            text: "This is an automated email sent by node-cron."
        };

        try {
            const info = await transporter.sendMail(mailbody);
            console.log("✅ Email sent:", info.response);
        } catch (err) {
            console.error("❌ Failed to send email:", err.message);
        }
    });
});


module.exports = router;