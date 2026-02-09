//----------- Here we start api call and data get from MY SQL SP and also made encryption aes 256 from api to sp--->
const helmet = require("helmet");
require('dotenv').config();
const mysql = require("mysql2");
const express = require('express');
const cors = require('cors');
const crypto = require("crypto");
const app = express();
exports.app = app;
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:6000"]
}))

app.use(helmet());
const AES_KEY = Buffer.from(process.env.AES_KEY_HEX, "hex");

function encryptAES256CBC(plainText) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(plainText), "utf8"),
    cipher.final()
  ]);

  return {
    cipherHex: encrypted.toString("hex"),  // send hex to API
    ivHex: iv.toString("hex")
  };
}

function decryptAES256CBC(cipherHex, ivHex) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    AES_KEY,
    Buffer.from(ivHex, "hex")
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherHex, "hex")),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString("utf8"));
}

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true   // 👈 MUST
});

// Test DB connection
conn.connect((err) => {
  if (err) {
    console.log("Database Connection Error:", err);
  } else {
    console.log("MySQL Connected Successfully!");
  }
});

function logErrorToDB(endpoint, errorMsg, requestBody) {
  const query = `
    INSERT INTO api_error_logs (endpoint, error_message, request_body)
    VALUES (?, ?, ?)
  `;

  conn.query(query, [endpoint, errorMsg, JSON.stringify(requestBody)], (err) => {
    if (err) {
      console.error("❌ Failed to log error to DB:", err);
    } else {
      console.log("✅ Error logged to database");
    }
  });
}

// --------------------------------------------------
//   POST API to call Stored Procedure GetUserListFilter()
// --------------------------------------------------

app.post("/get-user-filter", (req, res) => {

  // Allowed parameters (you can adjust this list)
  const allowedParams = ["gstin", "cpin", "state", "bank", "paymode"];

  // Check for unknown params
  const receivedParams = Object.keys(req.body);
  const invalidParams = receivedParams.filter(p => !allowedParams.includes(p));

  if (invalidParams.length > 0) {
    const errorMsg = "Invalid Parameters: " + invalidParams.join(", ");
    console.error(errorMsg);

    // Save in DB
    logErrorToDB("/get-user-filter", errorMsg, req.body);
    return res.status(400).json({
      status: false,
      message: "Invalid parameters in request : " + invalidParams,
    });
  }

  // Extract valid params with default values
  const {
    gstin = "",
    cpin = "",
    state = "",
    bank = "",
    paymode = "",
  } = req.body;

  const query = "CALL GetUserListFilter(?, ?, ?, ?, ?)";
  conn.query(
    query,
    [gstin, cpin, state, bank, paymode],
    async (err, result) => {

      if (err) {
        const errorMsg = err.sqlMessage || err.message;
        console.error("Stored Procedure Error:", errorMsg);

        // Save in DB
        logErrorToDB("/get-user-filter", errorMsg, req.body);

        return res.status(500).json({
          status: false,
          message: "Stored Procedure Error",
          error: err,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Filtered data fetched successfully",
        data: result[0],
      });
    }
  );
});

// --------------------------------------------------
//   Get API to call Stored Procedure GetUserList()
// --------------------------------------------------
app.get("/get-Gst-list", (req, res) => {
  const query = "CALL GetUserList()";
  conn.query(
    query,
    async (err, result) => {

      if (err) {
        const errorMsg = err.sqlMessage || err.message;
        console.error("Stored Procedure Error:", errorMsg);

        // Save in DB
        logErrorToDB("/get-error-log", errorMsg, req.body || {});

        return res.status(500).json({
          status: false,
          message: "Stored Procedure Error",
          error: err,
        });
      }
      return res.status(200).json({
        status: true,
        message: "data fetched successfully",
        data: result[0],
      });
    }
  );
})

// --------------------------------------------------
//   Get API to call Stored Procedure GetErrorLogList()
// --------------------------------------------------
app.get("/get-Error-log-list", (req, res) => {
  const query = "CALL GetErrorLogList()";
  conn.query(
    query,
    async (err, result) => {

      if (err) {
        const errorMsg = err.sqlMessage || err.message;
        console.error("Stored Procedure Error:", errorMsg);

        // Save in DB
        logErrorToDB("/get-error-log", errorMsg, req.body || {});

        return res.status(500).json({
          status: false,
          message: "Stored Procedure Error",
          error: err,
        });
      }
      return res.status(200).json({
        status: true,
        message: "data fetched successfully",
        data: result[0],
      });
    }
  );
})

// --------------------------------------------------
//   Get API to call Stored Procedure GetuserList_Limit()
// --------------------------------------------------
app.post("/get-userlist-limit", (req, res) => {
  const { Page_Number = "", Page_Size = "" } = req.body;

  // Prepare payload
  const payload = { Page_Number, Page_Size };
  // Encrypt before sending
  const { cipherHex, ivHex } = encryptAES256CBC(payload);
  console.log("cipherhex", cipherHex, "ivhex", ivHex)

  const query = `
  set @p_response_cipher_hex = '';
  call gst.GetuserList_Limit(?, ?, @p_response_cipher_hex);
  select @p_response_cipher_hex;
  `;
  conn.query(query, [cipherHex, ivHex], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: "SP Error",
        error: err
      });
    }

    // 4️⃣ Read encrypted response
    const jsonString = result[2][0]['@p_response_cipher_hex'];
    if (!jsonString) {
      return res.status(500).json({
        status: false,
        message: "Encrypted response is empty"
      });
    }
 console.log("decrypt__with", jsonString, ivHex)
    const decryptedJson = decryptAES256CBC(jsonString, ivHex);
    console.log("decrypt__without_", decryptedJson)

    // 5️⃣ Decrypt response
    return res.status(200).json({
      status: true,
      message: "Success",
      data: decryptedJson
    });
  });
});

// Get APi to call Stored Procedure 

// Start Server
app.listen(process.env.PORT, () => {
  console.log("Server running on port");
});

// 225978
// 3001/375185302/00/000