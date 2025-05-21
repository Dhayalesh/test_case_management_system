const { getUserByEmail } = require("../models/userModel");

const loginUser = (req, res) => {
  const { email, password } = req.body;

  getUserByEmail(email, (err, user) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (password === user.password) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
};

module.exports = { loginUser };
