const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const testGroupRoutes = require("./routes/testGroupRoutes");
const testCaseDetailsRoutes = require("./routes/testCaseDetailsRoutes");
const runTestCaseRoutes = require("./routes/runTestCaseRoutes");

app.use("/", authRoutes);
app.use("/", testGroupRoutes);
app.use("/", testCaseDetailsRoutes);
app.use("/", runTestCaseRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
