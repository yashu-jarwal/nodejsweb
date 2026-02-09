const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /employee/insert/mapping:
 *   post:
 *     summary: Insert a new employee record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: integer
 *               Name:
 *                 type: string
 *               Age:
 *                 type: integer
 *               Active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully inserted employee
 *       500:
 *         description: Error inserting employee
 */
router.post('/employee/insert/mapping', function (req, res) {
    console.log("requ___", req.body);
    let Id = req.body.Id;
    const Name = req.body.Name;
    const Age = req.body.Age;
    const Active = req.body.Active;
    // var qry = "INSERT INTO `Employee`(`Id`,`Name`, `Age`, `Active`) VALUES (ID,Name,Age,Active)"

    // new sql.Request().query("INSERT INTO Employee  (?,?,?,?) VALUES", [Id, Name, Age, Active], (err, result) => {
    new sql.Request().query("INSERT INTO Employee(Id, Name, Age, Active) VALUES ('" + Id + "','" + Name + "','" + Age + "','" + Active + "')", (err, result) => {

        // new sql.Request().query("INSERT INTO Employee('Id','Name', 'Age', 'Active') VALUES ('"+req.body.Id+"','"+req.body.Name+"','"+req.body.Age+"','"+req.body.Active+"')", (err, result) => {
        // sql.query(qry, function(err, result)  {
        if (err) {
            console.log("error___", err);
        }
        else {
            console.log("connect_insert");
            res.send("posted")
        }
    })
})


/**
 * @swagger
 * /employee/update/mapping:
 *   post:
 *     summary: update a new employee record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: integer
 *               Name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully update employee
 *       500:
 *         description: Error update employee
 */
router.post('/employee/update/mapping', function (req, res) {
    let Id = req.body.Id;
    let Name = req.body.Name;
    console.log("bodyyyy_", Id, Name);
    // new sql.Request().query('UPDATE Employee SET ? WHERE ?',[req.body.Name, req.body.Id], (err, result) => {
    // const queryString = "DELETE Employee WHERE ID = ?";
    new sql.Request().query("update Employee set Name=Name where ID=Id", (err, result) => {
        if (err) {
            console.log("error___", err);
        }
        else {
            console.log("connect_insert");
            res.send("Updated", result)
        }
    })
})

/**
 * @swagger
 * /employee/delete/mapping:
 *   post:
 *     summary: delete a new employee record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully delete employee
 *       500:
 *         description: Error delete employee
 */
router.delete('/employee/delete/mapping', function (req, res) {
    let Id = req.body.Id;
    console.log("bodyyyy_", Id);
    new sql.Request().query('delete Employee where Id=' + Id, (err, result) => {
        if (err) {
            console.log("error___", err);
        }
        else {
            console.log("connect_insert");
            res.send({
                "Status": true,
                "Message": 'Data Successfully Deleted'
            })
        }
    })
})

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Authenticates a user with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserName:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success or failure
 *       500:
 *         description: Server error
 */
router.post("/User/Login", (request, response) => {
    // Execute a SELECT query
    var UserName = request.body.UserName;
    var Password = request.body.Password;
    console.log("bodyyyy_", UserName, Password);
    // new sql.Request().query("select * from Student where UserName=? and Password=?",[UserName,Password], (err, result) => {
        new sql.Request().query('SELECT * FROM Student WHERE UserName= UserName', (err, result) => {

        if (err) {
            console.error("Error executing query:", err);
        } else {
            console.error("response executing query:", result.recordset);
            // response.send(result); // Send query result as response
            if (result.recordset.length > 0) {
                response.send({
                    'status': 1,
                    'result': {
                        'UserId': result.recordset
                    },
                    'Message': 'Success'
                })
            }
            else {
                response.send({
                    'status': 0,
                    'result': {}
                })
            }

        }
    });
});

module.exports = router;
