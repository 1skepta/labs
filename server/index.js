// server/index.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON from frontend

// Test route
app.get("/", (req, res) => {
  res.send("Lab Management API is running ✅");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
