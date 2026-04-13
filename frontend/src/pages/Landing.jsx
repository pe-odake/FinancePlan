import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../css/Landing.css";
import Header from "../component/Header";

function Landing() {
  const { authenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "FinancePlan - Sua Vida Financeira";
    if (!loading && authenticated) {
      navigate("/dashboard");
    }
  }, [authenticated, loading, navigate]);
  return (
    <div className="landing">
      {/* HEADER */}

      <Header />

      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1>
              FinancePlan a plataforma para seu{" "}
              <span className="highlight">controle financeiro</span>
            </h1>

            <p>
              Simule investimentos, gerencie despesas e acompanhe cotações em tempo real.
              <strong> Aviso:</strong> Este é um projeto de portfólio pessoal, 
              e não se trata de uma empresa ou serviço financeiro real.
            </p>

            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate("/login", { state: { activeTab: "signup" } })}
            >
              Criar conta gratuita
            </button>
          </div>

          <div className="hero-image">
            <div className="mockup">
              <img src="src\assets\finance_plan.png" alt="Dashboard Preview"  id="dashboard-preview"/>
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS */}
      <section className="features" id="recursos">
        <div className="container">
          <div className="section-header">
            <h2>Nossos principais recursos</h2>
            <h3>
              Tudo o que você precisa para sua educação financeira em um só
              lugar
            </h3>
            <p>
              Explore uma interface moderna desenvolvida para demonstrar capacidades 
              tecnológicas. Lembre-se: esta plataforma é um projeto educacional.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <span className="material-symbols-outlined feature-icon">
                account_balance_wallet
              </span>
              <h4>Gestão de sua vida financeira</h4>
              <p>
                Tenha uma visão completa das suas finanças, com gráficos
                intuitivos e relatórios de receitas e despesas.
              </p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined feature-icon">
                trending_up
              </span>
              <h4>Simulação de Investimentos</h4>
              <p>
                Simule diferentes cenários de investimento e veja como seu
                dinheiro pode render.
              </p>
            </div>

            <div className="feature-card">
              <span className="material-symbols-outlined feature-icon">
                attach_money
              </span>
              <h4>Câmbio de moedas</h4>
              <p>
                Cotações atualizadas para planejar viagens ou investimentos
                internacionais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Pronto para transformar sua vida financeira?</h2>
          <p>
            Junte-se ao FinancePlan para gerenciar seu dinheiro de forma
            inteligente.
          </p>

          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate("/login", { state: { activeTab: "signup" } })}
          >
            Começar agora gratuitamente
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h4>FinancePlan</h4>
            <p>
              Projeto de portfólio desenvolvido para demonstração de habilidades 
              em engenharia de software e design de interfaces. Não é uma empresa real.
            </p>
          </div>

          <div>
            <h5>Plataforma</h5>
            <a href="#">Recursos</a>
            <a href="#">Segurança</a>
            <a href="#">Preços</a>
          </div>

          <div>
            <h5>Empresa</h5>
            <a href="#">Sobre nós</a>
            <a href="#">Blog</a>
            <a href="#">Carreiras</a>
          </div>

          <div>
            <h5>Legal</h5>
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 FinancePlan | Pedro Odake | Todos os direitos reservados. | Projeto para Portfolio
        </div>
      </footer>
    </div>
  );
}

export default Landing;
