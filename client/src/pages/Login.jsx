import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import supabase from "../config/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log("Error signing in", error);
      return;
    }
    navigate("/addBook");
  };

  return (
    <>
      <p>Login</p>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label for="email">Email</label>
          <input
            type="email"
            placeholder="Email"
            name="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label for="password">Password</label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
};

export default Login;
