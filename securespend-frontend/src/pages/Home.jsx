import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home">
            {/* Navbar — logo left, auth buttons right, NO nav links */}
            <div className="home-navbar">
                <h2>SecureSpend</h2>
                <div>
                    <button onClick={() => navigate("/login")}>Login</button>
                    <button className="register-btn" onClick={() => navigate("/register")}>
                        Register
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="hero">
                <h1>AI Powered Transaction Surveillance System</h1>
                <p>
                    Detect fraud transactions
                    <br />
                    Track expenses smartly
                    <br />
                    Monitor payment behavior
                </p>
                <div className="hero-buttons">
                    <button onClick={() => navigate("/register")}>Get Started</button>
                    <button className="login-btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                </div>
            </div>

            {/* Features */}
            <div className="features">
                <h2>Our Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        💳
                        <h3>Payment Monitoring</h3>
                        <p>Track UPI, Card and Wallet usage</p>
                    </div>
                    <div className="feature-card">
                        ⚠
                        <h3>Fraud Detection</h3>
                        <p>Detect unusual transactions</p>
                    </div>
                    <div className="feature-card">
                        📊
                        <h3>Analytics</h3>
                        <p>Visual expense reports</p>
                    </div>
                    <div className="feature-card">
                        🔔
                        <h3>Smart Alerts</h3>
                        <p>Instant fraud notifications</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <p>SecureSpend © 2026</p>
            </div>
        </div>
    );
}

export default Home;