import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      <h2>Co-Author AI</h2>

      {user ? (
        <button
          style={{ float: "right" }}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
