import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 //const navigate = useNavigate();

  const handleLogin = async () => {
    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login Successful!");
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      {/* NAVBAR */}
      <nav className="login-nav">
        <div className="logo">SecureSpend</div>
      </nav>

      {/* LOGIN CARD */}
      <div className="login-container">
        <div className="login-box">
          <h2>SecureSpend</h2>
          <p className="subtitle">Manage your expenses smartly</p>

          <div className="input-box">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <button onClick={handleLogin}>Login</button>

          <p className="register-text">
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;