"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      router.replace("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    if (!email && !password) {
      setError("Please fill email and password!");
      return;
    } else if (!email) {
      setError("Please enter your email!");
      return;
    } else if (!password) {
      setError("Please enter your password!");
      return;
    }

    try {
      const response = await axios.post("http://51.20.12.147/login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("loggedIn", "true");
        router.replace("/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password!");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button onClick={handleLogin} className={styles.btn}>
          Login
        </button>
        <p className={styles.hint}>
          Use <strong>admin@ktern.com</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
