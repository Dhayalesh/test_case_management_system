"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem("loggedIn") === "true") {
      router.replace("/dashboard");
    }
  }, []);

  const handleLogin = () => {
    if (email === "admin@ktern.com" && password === "admin123") {
      localStorage.setItem("loggedIn", "true");
      router.replace("/dashboard"); // replace history to prevent back nav
    } else {
      setError("Invalid email or password!");
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
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
