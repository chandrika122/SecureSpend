import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields!");
      return;
    }

    const registerData = {
      full_name: name.trim(),
      email: email.trim(),
      password: password,
    };

    console.log("Sending to backend:", registerData);

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Registration Successful!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Registration Failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Server error - check if backend is running");
    }
  };

  return (
    <div className="login-page">
      {/* NAVBAR */}
      <nav className="login-nav">
        <div className="logo">SecureSpend</div>
      </nav>

      {/* REGISTER CARD */}
      <div className="login-container">
        <div className="login-box">
          <h2>SecureSpend</h2>
          <p className="subtitle">Create your account</p>

          <div className="input-box">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

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

          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <button onClick={handleRegister}>Register</button>

          <p className="register-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;