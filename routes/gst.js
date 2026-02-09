const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /gst_tab1:
 *   get:
 *     summary: Get all GST records with State_Code = 15488
 *     responses:
 *       200:
 *         description: A list of GST records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */
//Read All
router.get('/gst_tab1', async (req, res) => {
    try {
        await promisePool.query('select * from gsttab1 where State_Code=15488', (err, result) => {
            console.log("successfully fatch", result);
            res.json(result)
        })
    } catch (err) {
        res.status(500).send(err.message);
    }
});


/**
 * @swagger
 * /gst_tab1/Insert:
 *   post:
 *     summary: Insert a new GST record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cpin:
 *                 type: string
 *               gstin:
 *                 type: string
 *               Temporary_ID:
 *                 type: string
 *               State_Code:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully inserted GST record
 *       500:
 *         description: Internal server error
 */
// Create
router.post('/gst_tab1/Insert', async (req, res) => {
    console.log("requerst_", req.body)
    const { cpin, gstin, Temporary_ID, State_Code } = req.body;
    try {
        await promisePool.query('INSERT INTO gsttab1 (cpin, gstin, Temporary_ID,State_Code) VALUES (?, ?,?,?)', [cpin, gstin, Temporary_ID, State_Code], (err, result) => {
            console.log("successfully Inserted", result);
            res.json(result)
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

/**
 * @swagger
 * /gst_tab1/delete/{State_Code}:
 *   delete:
 *     summary: Delete a GST record by State_Code
 *     parameters:
 *       - in: path
 *         name: State_Code
 *         required: true
 *         schema:
 *           type: integer
 *         description: State code of the GST record to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the record
 *       500:
 *         description: Internal server error
 */

// Delete
router.delete('/gst_tab1/delete/:State_Code', async (req, res) => {
    const { State_Code } = req.params;
    try {
        await promisePool.query('DELETE FROM gsttab1 WHERE State_Code = ?', [State_Code], (err, result) => {
            console.log("successfully deleted", result);
            res.json(result)
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
