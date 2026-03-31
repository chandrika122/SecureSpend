import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <h2>SecureSpend</h2>
      <ul>
        <li
          className={location.pathname === "/dashboard" ? "active-menu" : ""}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </li>
        <li
          className={location.pathname === "/expenses" ? "active-menu" : ""}
          onClick={() => navigate("/expenses")}
        >
          Expenses
        </li>
        <li
          className={location.pathname === "/reports" ? "active-menu" : ""}
          onClick={() => navigate("/reports")}
        >
          Reports
        </li>
        <li
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
