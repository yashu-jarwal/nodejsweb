const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Send a real email using Gmail SMTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Receiver email address
 *               subject:
 *                 type: string
 *                 description: Subject of the email
 *               text:
 *                 type: string
 *                 description: Email body content
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       500:
 *         description: Failed to send email
 */
// create transporter using gmail SMTP

router.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body
    const sender_email = "yashujrwl@gmail.com"
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender_email,
            pass: "fbfr amss cqke rbyf"
        }
    });

    const mailbody = {
        from: sender_email,
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailbody);
        console.log("mail_info", info);
        res.status(200).json({ message: 'Email Sent successfully', info });
    }
    catch (err) {
        res.status(500).json({ error: 'fail to send email', details: err })
    }
})


module.exports = router;

