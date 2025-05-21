const loginUser = (req, res) => {
  const { email, password } = req.body;

  const validEmail = "admin@example.com";
  const validPassword = "admin123";

  if (email === validEmail && password === validPassword) {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

module.exports = { loginUser };
