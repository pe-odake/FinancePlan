import { useContext, useEffect, useState } from "react"; 
import "../css/Dashboard.css";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Dashboard() {
  const { authenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // API
  const [dadosDespesa, setDadosDespesa] = useState([]);
  const [dadosReceita, setDadosReceita] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/login");
    }

    if (authenticated) {
      const carregarDados = async () => {

        // DESPESAS
        try {
          const response = await fetch("http://127.0.0.1:8000/despesas", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Se usar JWT, descomente a linha abaixo:
              // "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
          });

          if (response.ok) {
            const dataDespesa = await response.json();
            setDadosDespesa(dataDespesa);
          } else {
            console.error("Erro na resposta da API:", response.status);
          }
        } catch (error) {
          console.error("Erro ao conectar com o FastAPI:", error);
        } finally {
          setFetching(false);
        }

        // RECEITAS
        try {
          const response = await fetch("http://127.0.0.1:8000/receitas", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const dataReceita = await response.json();
            setDadosReceita(dataReceita);
          } else {
            console.error("Erro na resposta da API:", response.status);
          }
        } catch (error) {
          console.error("Erro ao conectar com o FastAPI:", error);
        } finally {
          setFetching(false);
        }
      };

      carregarDados();
    }
  }, [authenticated, loading, navigate]);

  if (loading || (authenticated && fetching)) {
    return <div className="loading">Carregando dados...</div>;
  }

  if (!authenticated) {
    return null;
  }

  const valorTotalDespesas = dadosDespesa.reduce((acc, curr) => acc + Number(curr.valor_despesa), 0);
  const valorTotalReceita = dadosReceita.reduce((acc, curr) => acc + Number(curr.valor_receita), 0);

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
              <h3>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalDespesas)} TROCAR </h3>
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

            <h3 className="value-green">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalReceita)}</h3>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="label">Despesas</span>
              <span className="material-symbols-outlined icon-red">
                arrow_downward
              </span>
            </div>

            <h3 className="value-red">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalDespesas)}</h3>
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
                <span>R$ ***,**</span>
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

                <span className="value negative">- R$ ***,**</span>
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

                <span className="value positive">+ R$ ***,**</span>
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

                <span className="value negative">- R$ ***,**</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
