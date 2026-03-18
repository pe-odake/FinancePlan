import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../css/Login.css";

function Login() {
  const [activeTab, setActiveTab] = useState("login");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const loginData = { email, password };

    try {
      const response = await fetch("http://127.0.0.1:8000/login", { // criar pela .env um if para mudar URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        
        navigate("/dashboard");
      } else {
        alert("Credenciais inválidas!");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
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
                onClick={() => setActiveTab("login")}
              >
                Entrar
              </button>
              <button
                className={activeTab === "signup" ? "active" : ""}
                onClick={() => setActiveTab("signup")}
              >
                Criar Conta
              </button>
            </div>

            {/* FORM LOGIN */}
            {activeTab === "login" && (
              <div className="form-content">
                <h1>Bem-vindo de volta!</h1>
                <p>Insira seus dados para acessar sua conta.</p>

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Senha:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary-login full">
                    Acessar FinancePlan
                  </button>
                </form>
              </div>
            )}

            {/* FORM SIGNUP - IMPLEMENTAR AINDA CADASTRO */}
            {activeTab === "signup" && (
              <div className="form-content">
                <h1>Comece sua jornada</h1>
                <p>Crie sua conta gratuita em poucos segundos.</p>

                <form>
                  <div className="input-group">
                    <label>Nome completo</label>
                    <input type="text" placeholder="Seu nome" />
                  </div>

                  <div className="input-group">
                    <label>E-mail</label>
                    <input type="email" placeholder="nome@exemplo.com" />
                  </div>

                  <div className="input-group">
                    <label>Senha</label>
                    <input type="password" placeholder="Mínimo 8 caracteres" />
                  </div>

                  <button className="btn-primary-login full">
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
