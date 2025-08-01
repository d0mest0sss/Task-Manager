import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/login", new URLSearchParams({
        username,
        password,
      }), {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      onLogin();
    } catch (err) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className = "form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
    </form>

    <p>
      Don't have an account? <Link to="/register">Register here</Link>
    </p>

    </div>
    
  );
};

export default LoginForm;
