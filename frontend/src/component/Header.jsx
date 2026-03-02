import "../css/Header.css";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <span>FinancePlan</span>
          </div>

          <nav className="nav">
            <a href="#">Início</a>
            <a href="#recursos">Recursos</a>
            <a href="#">Blog</a>
          </nav>

          <div className="header-buttons">
            <button className="btn btn-outline"><Link to="/login">Login</Link></button>
            <button className="btn btn-primary-header"><Link to="/login">Começar agora</Link></button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
