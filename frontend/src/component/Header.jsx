import "../css/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function Header() {
  const { authenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container-header header-content">
        
        {/* LOGO */}
        <div className="logo">
          <span>FinancePlan</span>
        </div>

        {/* NAV */}
        <nav className="nav">
          {!authenticated ? (
            <>
              <Link to="/">Início</Link>
              <Link to="/">Investimentos</Link>
              <Link to="/">Tutoriais</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/">Investimentos</Link>
              <Link to="/">Tutoriais</Link>
            </>
          )}
        </nav>

        {/* DIREITA */}
        <div className="header-right">
          {authenticated ? (
            <div className="user-area">
              <span className="user-text">
                Olá {user?.nome || "Usuário"}
              </span>

              <div className="avatar"></div>

              <button
                className="btn btn-outline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="header-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary-header">
                Registrar
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;