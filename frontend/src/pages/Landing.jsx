import "../css/Landing.css";

function Landing() {
  return (
    <div className="landing">
      {/* HEADER */}
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
            <button className="btn btn-outline">Login</button>
            <button className="btn btn-primary">Começar agora</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1>
              FinancePlan a plataforma para seu{" "}
              <span className="highlight">controle financeiro</span>
            </h1>

            <p>
              Subtexto explicando os benefícios do FinancePlan para sua vida
              financeira e como nossa plataforma ajuda você a atingir seus
              objetivos de forma simples e eficiente.
            </p>

            <button className="btn btn-primary btn-large">
              Criar conta gratuita
            </button>
          </div>

          <div className="hero-image">
            <div className="mockup">
              <span>Dashboard Preview</span>
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
              Texto explicando sobre nossos serviços de forma simplificada e
              focada na experiência do usuário.
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

          <button className="btn btn-primary btn-large">
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
              A plataforma completa para você dominar suas finanças e construir
              seu patrimônio com inteligência.
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
          © 2026 FinancePlan | Pedro Odake | Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default Landing;
