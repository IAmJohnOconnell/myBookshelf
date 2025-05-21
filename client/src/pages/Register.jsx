import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import supabase from "../config/supabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.log("Error signing up", error);
      return;
    }
    navigate("/login");
  };

  return (
    <form
      action="/register"
      method="POST"
      className={styles.loginForm}
      onSubmit={handleRegister}
    >
      <div className={styles.formGroup}>
        <label for="email">Email</label>
        <input
          type="email"
          class="form-control"
          name="username"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label for="password">Password</label>
        <input
          type="password"
          class="form-control"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </div>
      <button type="submit" class="btn btn-dark">
        Register
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Register;
