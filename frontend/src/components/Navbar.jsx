import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      <h2 style={{ display: "inline-block", marginRight: "20px" }}>
        Co-Author AI
      </h2>

      <div style={{ float: "right", display: "flex", gap: "20px" }}>
        {!user && (
          <>
            <Link to="/login" style={{ color: "white" }}>
              Login
            </Link>

            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/" style={{ color: "white" }}>
              Dashboard
            </Link>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={{
                background: "white",
                color: "black",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}