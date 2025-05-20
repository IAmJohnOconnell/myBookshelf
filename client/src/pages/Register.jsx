import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(data.redirectTo); // Redirect to the specified route
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error registering:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form action="/register" method="POST" onSubmit={handleRegister}>
      <div class="form-group">
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
      <div class="form-group">
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
