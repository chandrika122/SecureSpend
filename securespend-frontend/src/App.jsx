import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Sidebar from "./components/Sidebar";

/* Shared layout wrapper for authenticated pages */
function AuthLayout({ children }) {
    return (
        <div className="dashboard">
            <Sidebar />
            {children}
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <AuthLayout>
                        <Dashboard />
                    </AuthLayout>
                }
            />
            <Route
                path="/expenses"
                element={
                    <AuthLayout>
                        <Expenses />
                    </AuthLayout>
                }
            />
            <Route
                path="/reports"
                element={
                    <AuthLayout>
                        <Reports />
                    </AuthLayout>
                }
            />
        </Routes>
    );
}

export default App;