import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(data.redirectTo);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occured. Please try again.");
    }
  };

  return (
    <>
      <p>Login</p>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          type="email"
          placeholder="Email"
          name="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
};

export default Login;
