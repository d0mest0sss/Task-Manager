import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        username,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        setMessage("✅ Registration successful. Redirecting...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage("⚠️ Unexpected server response.");
      }
    } catch (err) {
      console.error("Register failed:", err);
      if (err.response?.status === 409) {
        setMessage("⚠️ Username already taken.");
      } else {
        setMessage("❌ Registration failed. Try again.");
      }
    }
  };

  return (
  <div className="form-container">
    <h2>Register</h2>
    <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "10.5px" }}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
    {message && <p>{message}</p>}
    <p>
      Already have an account? <Link to="/login">Return to Login</Link>
    </p>
  </div>
);
};

export default Register;
