const express = require('express');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

const router = express.Router();

/**
 * @swagger
 * /qr:
 *   get:
 *     summary: Generate a QR code that links to a PDF file
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the PDF file in the /files folder
 *     responses:
 *       200:
 *         description: Returns an HTML page with a QR code that links to the PDF
 *       500:
 *         description: Error generating QR code
 */
// Route to generate QR for the PDF
router.get('/qr', async (req, res) => {
    const pdfFileName = req.query.name || 'download.pdf';
    const fileUrl = `http://localhost:3000/files/${pdfFileName}`;

    try {
        const qrImage = await QRCode.toDataURL(fileUrl);
        res.send(`
      <h2>Scan this QR to open the PDF</h2>
      <img src="${qrImage}" /><br/><br/>
      <p><strong>PDF URL:</strong> <a href="${fileUrl}" target="_blank">${fileUrl}</a></p>
    `);
    } catch (err) {
        res.status(500).send('❌ Error generating QR');
    }
});


/**
 * @swagger
 * /read/{filename}:
 *   get:
 *     summary: Read a text file and return its contents
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to read
 *     responses:
 *       200:
 *         description: File contents returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *       500:
 *         description: Error reading file
 */
router.get('/read/:filename', (req, res) => {
    console.log("file_read", req.params.filename);

    try {
        const data = fs.readFileSync(req.params.filename, 'utf8');
        res.send({ content: data });
    } catch (err) {
        console.log("error_read", err);
        res.status(500).send({ error: 'File read failed' });
    }
});


/**
 * @swagger
 * /append:
 *   post:
 *     summary: Append a new line to a text file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: The name (or path) of the text file
 *               newLine:
 *                 type: string
 *                 description: The new line to append
 *     responses:
 *       200:
 *         description: Line added successfully
 *       500:
 *         description: Append failed
 */
// append text file 
router.post('/append', (req, res) => {
    const { filename, newLine } = req.body;
    fs.appendFile(filename, newLine + '\n', (err) => {
        if (err) return res.status(500).send({ error: 'Append failed' });
        res.send({ message: 'Line added successfully' });
    });
});


/**
 * @swagger
 * /remove:
 *   post:
 *     summary: Remove the last line from a text file
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *                 description: The name (or relative path) of the file to modify
 *     responses:
 *       200:
 *         description: Successfully removed the last line
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: last line remove from file
 *       500:
 *         description: Error while reading or writing the file
 */
// delete text file 
router.post('/remove', (req, res) => {
    const { filename } = req.body;
    const safepath = path.join(__dirname, '..',filename);
    fs.readFile(safepath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error_", err)
            return res.status(500).send({ error: "fail to read file" })
        }
        const lines = data.split('\n');
        lines.pop();
        fs.writeFile(safepath, lines.join('\n'), 'utf-8', (err) => {
            if (err) {
                return res.status(500).send({ error: "fail to write file" })
            }
            res.send({ message: "last line remove from file" });
        });
    });
});


/**
 * @swagger
 * /generate-pdf:
 *   post:
 *     summary: Generate a PDF with title, content, and logo
 *     description: Creates and returns a downloadable PDF file with a logo image, title, table of contents, and user-provided content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Report
 *               content:
 *                 type: string
 *                 example: This is the body content of the PDF document.
 *     responses:
 *       200:
 *         description: PDF generated and sent for download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error while generating PDF
 */
// generate Pdf and download
router.post('/generate-pdf', (req, res) => {
  const { title, content } = req.body;

  // Create a PDF document
  const doc = new PDFDocument();
  
  // Set headers to prompt download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');

  // Pipe PDF to response
  doc.pipe(res);

  // ✅ Add Logo
  const logoPath = path.join(__dirname, 'logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 50, { width: 100 });
    doc.moveDown(2);
  }

  // 🏷️ Add Title
  doc.fontSize(20).text(title || 'Untitled Document', { align: 'center' });
  doc.moveDown();

  // 📑 Add Table of Contents (simple simulation)
  doc.fontSize(14).text('Table of Contents');
  doc.text('1. Introduction');
  doc.text('2. Main Content');
  doc.text('3. Conclusion');
  doc.moveDown();
  doc.moveDown();

  // 📝 Add Main Content
  doc.fontSize(12).text(content || 'No content provided', { align: 'left' });

  doc.end(); // Finish the PDF
})

module.exports = router;
