const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);  // POST /login

app.listen(5000, "0.0.0.0", () => {
  console.log(`✅ Server is running at http://localhost:5000`);
});
