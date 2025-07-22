const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const departmentRoutes = require("./routes/departments");
const sectionRoutes = require("./routes/sections");
const patientRoutes = require("./routes/patients");
const labTestRoutes = require("./routes/labTests");
const labRequestRoutes = require("./routes/labRequests");
const authRoutes = require("./routes/authRoutes");
// const labReportRoutes = require("./routes/labReports");

app.use("/api/departments", departmentRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/lab-tests", labTestRoutes);
app.use("/api/lab-requests", labRequestRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/lab-reports", labReportRoutes);

app.get("/", (req, res) => {
  res.send("Lab Management API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
