import { useContext, useEffect } from "react";
import "../css/Dashboard.css";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Dashboard() {
  const { authenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/login");
    }
  }, [authenticated, loading, navigate]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!authenticated) {
    return null; // Ou uma mensagem, mas o useEffect redirecionará
  }

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-container">
        {/* <!-- CARDS --> */}
        <section className="cards">
          <div className="card">
            <div className="card-header">
              <span className="label">Saldo Total</span>
              <span className="material-symbols-outlined icon-gray">
                account_balance
              </span>
            </div>

            <div className="card-value">
              <h3>R$ 15.420,00</h3>
              <span className="badge positive">
                <span className="material-symbols-outlined">trending_up</span>
                2.5%
              </span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="label">Receitas</span>
              <span className="material-symbols-outlined icon-green">
                arrow_upward
              </span>
            </div>

            <h3 className="value-green">R$ 5.200,00</h3>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="label">Despesas</span>
              <span className="material-symbols-outlined icon-red">
                arrow_downward
              </span>
            </div>

            <h3 className="value-red">R$ 3.150,00</h3>
          </div>
        </section>

        {/* <!-- GRID --> */}
        <div className="grid">
          {/* <!-- GRÁFICO --> */}
          <div className="card">
            <h4 className="section-title">Distribuição de Gastos</h4>

            <div className="chart">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="chart-bg" />
                <circle cx="50" cy="50" r="40" className="chart-green" />
              </svg>

              <div className="chart-center">
                <span>R$ 3.150</span>
                <p>Total</p>
              </div>
            </div>
          </div>

          {/* <!-- MOVIMENTAÇÕES --> */}
          <div className="card">
            <h4 className="section-title">Últimas Movimentações</h4>

            <div className="list">
              {/* <!-- ITEM --> */}
              <div className="item">
                <div className="item-left">
                  <div className="icon-box orange">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>

                  <div>
                    <p className="title">Ifood Delivery</p>
                    <p className="subtitle">Ontem • Alimentação</p>
                  </div>
                </div>

                <span className="value negative">- R$ 85,90</span>
              </div>

              {/* <!-- ITEM --> */}
              <div className="item">
                <div className="item-left">
                  <div className="icon-box green">
                    <span className="material-symbols-outlined">payments</span>
                  </div>

                  <div>
                    <p className="title">Salário</p>
                    <p className="subtitle">01 Abr • Receita</p>
                  </div>
                </div>

                <span className="value positive">+ R$ 4.500,00</span>
              </div>

              {/* <!-- ITEM -->F */}
              <div className="item">
                <div className="item-left">
                  <div className="icon-box gray">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>

                  <div>
                    <p className="title">Energia</p>
                    <p className="subtitle">Conta</p>
                  </div>
                </div>

                <span className="value negative">- R$ 240,00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
