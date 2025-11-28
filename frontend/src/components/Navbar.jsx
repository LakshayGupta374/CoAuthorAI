import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-dark bg-dark px-4 shadow-sm">
      <Link to="/" className="navbar-brand fw-bold fs-4">
        ✍️ Co-Author AI
      </Link>

      <div>
        {user ? (
          <>
            <Link
              to="/"
              className="btn btn-outline-light me-2 rounded-pill px-3"
            >
              Dashboard
            </Link>

            <button
              className="btn btn-danger rounded-pill px-3"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-outline-light me-2 rounded-pill px-3"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-primary rounded-pill px-3"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}