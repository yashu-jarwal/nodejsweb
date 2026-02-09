const https = require('http')
const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors');
const path = require('path');
var app = express()
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // path to your swagger.js
const promisePool = require('./dbconfig')
app.use(
    bodyParser.json({
        extended: true
    })
);
app.use(cors())
// var sql = require("mysql");

// SQL Server configuration
// var config = {
//     "user": "sa", // Database username
//     "password": "123", // Database password
//     "server": "172.22.32.112", // Server IP address
//     "database": "hellodb", // Database name
//     "options": {
//         "encrypt": false // Disable encryption
//     }
// }
// var config = {
//     "user": "root", // Database username
//     "password": "yashu1437", // Database password
//     "server": "localhost", // Server IP address
//     "database": "gst", // Database name
//     "options": {
//         "encrypt": false // Disable encryption
//     }
// }

// // Connect to SQL Server
// sql.connect(config, err => {
//     if (err) {
//         throw err;
//     }
//     console.log("Connection Successful!");
// });

//my sql server connection code
// var con = sql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "yashu1437",
//     database:"gst"
//   });

//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });

// Middleware should come BEFORE your routes
app.use(express.json()); // ✅ Parse JSON body before hitting routes

// qr code and file read genrate
app.use('/files', express.static(path.join(__dirname, 'files')));


// socket io for chat app flow
const server = https.createServer(app);
const io = new Server(server);

// Serve static HTML/CSS/JS files
app.use(express.static(path.join(__dirname, 'ui html')));

// Swagger documentation available at /api-docs
app.use('/Swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const QrModule = require('./routes/text_file');
app.use(QrModule);

const EmployeeMoudle = require('./routes/Employee');
app.use(EmployeeMoudle);


const GstModule = require('./routes/gst');
app.use(GstModule);


const emailRoutes = require('./routes/Send_email'); // e.g., './routes/email'
app.use(emailRoutes);

const ScheduleTask = require('./routes/Schedule');
app.use(ScheduleTask);

const scraperRoute = require('./routes/Scrapper');
app.use('/api', scraperRoute);

const quiz = require('./routes/quiz');
app.use(quiz)

const Task1 = require('./Task/task1');
app.use(Task1)

const WeatherForcast = require('./WeatherForcast/Weather');
app.use(WeatherForcast)

// const setapilimit = require('./ApicallTimePrevent/index')
// app.use(setapilimit)



app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from server without CORS' });
});

server.listen(5000, () => {
    console.log('Server running at http://localhost:5000');
});