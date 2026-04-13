import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import API_URL from '../services/apiConfig';
import "../css/Login.css";

function Login() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "login");

  useEffect(() => {
    document.title = "FinancePlan - Login";
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register states
  const [regNome, setRegNome] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoginError("");

    const loginData = { email, password };

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        login({ user_id: data.user_id, nome: data.nome, email: data.email });
        navigate("/dashboard");
      } else {
        setLoginError("Credenciais inválidas!");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      setLoginError("Erro ao conectar com o servidor.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");

    if (regPassword.length < 8) {
      setRegError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    const registerData = { nome: regNome, email: regEmail, password: regPassword };

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        const data = await response.json();
        // Login automático após registro
        login({ user_id: data.user_id, nome: data.nome, email: data.email });
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setRegError(errorData.detail || "Erro ao criar conta.");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      setRegError("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* LADO ESQUERDO */}
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="brand">
              <span className="material-symbols-rounded brand-icon">
                account_balance_wallet
              </span>
              <span className="brand-name">FinancePlan</span>
            </div>

            <h2>
              Controle total da sua <span>vida financeira</span>
            </h2>

            <p>
              Gerencie despesas, acompanhe investimentos e simule cenários
              financeiros com uma plataforma moderna e inteligente.
            </p>

            <div className="auth-illustration">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="auth-right">
          <div className="auth-form-container">
            {/* TABS */}
            <div className="tabs">
              <button
                className={activeTab === "login" ? "active" : ""}
                onClick={() => { setActiveTab("login"); setLoginError(""); }}
              >
                Entrar
              </button>
              <button
                className={activeTab === "signup" ? "active" : ""}
                onClick={() => { setActiveTab("signup"); setRegError(""); }}
              >
                Criar Conta
              </button>
            </div>

            {/* FORM LOGIN */}
            {activeTab === "login" && (
              <div className="form-content">
                <h1>Bem-vindo de volta!</h1>
                <p>Insira seus dados para acessar sua conta.</p>

                {loginError && <div className="form-error">{loginError}</div>}

                <form onSubmit={handleLogin}>
                  <div className="input-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nome@exemplo.com"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Senha:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Sua senha"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary-login full">
                    Acessar FinancePlan
                  </button>
                </form>
              </div>
            )}

            {/* FORM SIGNUP */}
            {activeTab === "signup" && (
              <div className="form-content">
                <h1>Comece sua jornada</h1>
                <p>Crie sua conta gratuita em poucos segundos.</p>

                {regError && <div className="form-error">{regError}</div>}

                <form onSubmit={handleRegister}>
                  <div className="input-group">
                    <label>Nome completo</label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={regNome}
                      onChange={(e) => setRegNome(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>E-mail</label>
                    <input
                      type="email"
                      placeholder="nome@exemplo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Senha</label>
                    <input
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary-login full">
                    Criar minha conta
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
