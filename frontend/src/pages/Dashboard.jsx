import { useContext, useEffect, useState } from "react";
import "../css/Dashboard.css";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { financeServiceDespesas } from "../services/despesas";
import { financeServiceReceitas } from "../services/receitas";
import { financeServiceCategorias } from "../services/categorias";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Mapeamento de categoria → ícone Material Symbols
const CATEGORIA_ICONE = {
  "Alimentação": "restaurant",
  "Transporte": "directions_car",
  "Moradia": "home",
  "Saúde": "health_and_safety",
  "Educação": "school",
  "Lazer": "sports_esports",
  "Vestuário": "checkroom",
  "Contas": "bolt",
  "Salário": "payments",
  "Freelance": "work",
  "Investimentos": "trending_up",
  "Outros": "more_horiz",
};

// Paleta de cores para o gráfico por categoria
const CATEGORIA_CORES = {
  "Alimentação": "#f97316",
  "Transporte": "#3b82f6",
  "Moradia": "#8b5cf6",
  "Saúde": "#ef4444",
  "Educação": "#06b6d4",
  "Lazer": "#ec4899",
  "Vestuário": "#f59e0b",
  "Contas": "#64748b",
  "Salário": "#22c55e",
  "Freelance": "#14b8a6",
  "Investimentos": "#6366f1",
  "Outros": "#94a3b8",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  const day = String(date.getDate()).padStart(2, "0");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${day} ${months[date.getMonth()]}`;
};

function Dashboard() {
  const { authenticated, loading, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dadosDespesa, setDadosDespesa] = useState([]);
  const [dadosReceita, setDadosReceita] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalTipo, setModalTipo] = useState("despesa"); // "despesa" ou "receita"
  const [formNome, setFormNome] = useState("");
  const [formValor, setFormValor] = useState("");
  const [formData, setFormData] = useState(new Date().toISOString().split("T")[0]);
  const [formCategoria, setFormCategoria] = useState("");

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/login");
    }

    if (authenticated && user) {
      const carregarDados = async () => {
        try {
          const [listaDespesas, listaReceitas, listaCategorias] = await Promise.all([
            financeServiceDespesas.getDespesas(user.user_id),
            financeServiceReceitas.getReceitas(user.user_id),
            financeServiceCategorias.getCategorias(),
          ]);

          setDadosDespesa(listaDespesas);
          setDadosReceita(listaReceitas);
          setCategorias(listaCategorias);
        } catch (error) {
          console.error("Falha ao carregar painel", error);
        } finally {
          setFetching(false);
        }
      };

      carregarDados();
    }
  }, [authenticated, loading, navigate, user]);

  if (loading || (authenticated && fetching)) {
    return (
      <div className="dashboard">
        <Header />
        <div className="loading">Carregando dados...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  // ==================== FILTRO DO MÊS ATUAL ====================
  const now = new Date();
  const mesAtual = now.getMonth();
  const anoAtual = now.getFullYear();

  const despesasMes = dadosDespesa.filter((d) => {
    const dt = new Date(d.data_despesa + "T00:00:00");
    return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
  });

  const receitasMes = dadosReceita.filter((r) => {
    const dt = new Date(r.data_receita + "T00:00:00");
    return dt.getMonth() === mesAtual && dt.getFullYear() === anoAtual;
  });

  const valorTotalDespesa = despesasMes.reduce(
    (acc, curr) => acc + Number(curr.valor_despesa), 0
  );
  const valorTotalReceita = receitasMes.reduce(
    (acc, curr) => acc + Number(curr.valor_receita), 0
  );
  const valorTotalSaldo = valorTotalReceita - valorTotalDespesa;

  // ==================== MAPA DE CATEGORIAS ====================
  const categoriaMap = {};
  categorias.forEach((c) => {
    categoriaMap[c.categoria_id] = c.nome_categoria;
  });

  // ==================== GRÁFICO DONUT ====================
  const despesasPorCategoria = {};
  despesasMes.forEach((d) => {
    const catNome = categoriaMap[d.categoria_id] || "Outros";
    despesasPorCategoria[catNome] = (despesasPorCategoria[catNome] || 0) + Number(d.valor_despesa);
  });

  const chartLabels = Object.keys(despesasPorCategoria);
  const chartValues = Object.values(despesasPorCategoria);
  const chartColors = chartLabels.map((label) => CATEGORIA_CORES[label] || "#94a3b8");

  const donutData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: chartColors,
        borderWidth: 2,
        borderColor: "#fff",
        hoverBorderWidth: 3,
      },
    ],
  };

  const donutOptions = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
        },
      },
    },
  };

  // ==================== LISTA DE MOVIMENTAÇÕES ====================
  const movimentacoes = [
    ...dadosDespesa.map((d) => ({
      id: `d-${d.despesa_id}`,
      tipo: "despesa",
      nome: d.nome_despesa,
      valor: Number(d.valor_despesa),
      data: d.data_despesa,
      categoria: categoriaMap[d.categoria_id] || "Outros",
      originalId: d.despesa_id,
    })),
    ...dadosReceita.map((r) => ({
      id: `r-${r.receita_id}`,
      tipo: "receita",
      nome: r.nome_receita,
      valor: Number(r.valor_receita),
      data: r.data_receita,
      categoria: "Receita",
      originalId: r.receita_id,
    })),
  ].sort((a, b) => new Date(b.data) - new Date(a.data));

  // ==================== HANDLERS ====================
  const handleAddMovimentacao = async (e) => {
    e.preventDefault();

    try {
      if (modalTipo === "despesa") {
        const novaDespesa = await financeServiceDespesas.postDespesa({
          user_id: user.user_id,
          categoria_id: parseInt(formCategoria),
          nome_despesa: formNome,
          valor_despesa: parseFloat(formValor),
          data_despesa: formData,
        });
        setDadosDespesa((prev) => [...prev, novaDespesa]);
      } else {
        const novaReceita = await financeServiceReceitas.postReceita({
          user_id: user.user_id,
          nome_receita: formNome,
          valor_receita: parseFloat(formValor),
          data_receita: formData,
        });
        setDadosReceita((prev) => [...prev, novaReceita]);
      }

      // Reset form
      setFormNome("");
      setFormValor("");
      setFormData(new Date().toISOString().split("T")[0]);
      setFormCategoria("");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao adicionar movimentação:", error);
    }
  };

  const handleDelete = async (mov) => {
    try {
      if (mov.tipo === "despesa") {
        await financeServiceDespesas.deleteDespesa(mov.originalId);
        setDadosDespesa((prev) => prev.filter((d) => d.despesa_id !== mov.originalId));
      } else {
        await financeServiceReceitas.deleteReceita(mov.originalId);
        setDadosReceita((prev) => prev.filter((r) => r.receita_id !== mov.originalId));
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const openModal = (tipo) => {
    setModalTipo(tipo);
    setFormNome("");
    setFormValor("");
    setFormData(new Date().toISOString().split("T")[0]);
    setFormCategoria(categorias.length > 0 ? String(categorias[0].categoria_id) : "");
    setShowModal(true);
  };

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-container">
        {/* CARDS */}
        <section className="cards">
          <div className="card">
            <div className="card-header">
              <span className="label">Saldo Total</span>
              <span className="material-symbols-outlined icon-gray">
                account_balance
              </span>
            </div>
            <div className="card-value">
              <h3 className={valorTotalSaldo >= 0 ? "value-green" : "value-red"}>
                {formatCurrency(valorTotalSaldo)}
              </h3>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="label">Receitas</span>
              <span className="material-symbols-outlined icon-green">
                arrow_upward
              </span>
            </div>
            <h3 className="value-green">{formatCurrency(valorTotalReceita)}</h3>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="label">Despesas</span>
              <span className="material-symbols-outlined icon-red">
                arrow_downward
              </span>
            </div>
            <h3 className="value-red">{formatCurrency(valorTotalDespesa)}</h3>
          </div>
        </section>

        {/* GRID */}
        <div className="grid">
          {/* GRÁFICO */}
          <div className="card">
            <h4 className="section-title">Distribuição de Gastos</h4>

            {chartLabels.length > 0 ? (
              <>
                <div className="chart-donut-wrapper">
                  <Doughnut data={donutData} options={donutOptions} />
                  <div className="chart-center-overlay">
                    <span className="chart-center-value">{formatCurrency(valorTotalDespesa)}</span>
                    <p className="chart-center-label">Total</p>
                  </div>
                </div>

                <div className="chart-legend">
                  {chartLabels.map((label, i) => (
                    <div key={label} className="legend-item">
                      <span
                        className="legend-dot"
                        style={{ backgroundColor: chartColors[i] }}
                      ></span>
                      <span className="legend-label">{label}</span>
                      <span className="legend-value">{formatCurrency(chartValues[i])}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="chart-empty">
                <span className="material-symbols-outlined">pie_chart</span>
                <p>Sem despesas neste mês</p>
              </div>
            )}
          </div>

          {/* MOVIMENTAÇÕES */}
          <div className="card">
            <div className="movimentacoes-header">
              <h4 className="section-title">Últimas Movimentações</h4>
              <div className="add-buttons">
                <button className="btn-add receita" onClick={() => openModal("receita")} title="Nova Receita">
                  <span className="material-symbols-outlined">add</span>
                  Receita
                </button>
                <button className="btn-add despesa" onClick={() => openModal("despesa")} title="Nova Despesa">
                  <span className="material-symbols-outlined">remove</span>
                  Despesa
                </button>
              </div>
            </div>

            <div className="list">
              {movimentacoes.length === 0 ? (
                <div className="list-empty">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <p>Nenhuma movimentação registrada</p>
                </div>
              ) : (
                movimentacoes.slice(0, 10).map((mov) => (
                  <div className="item" key={mov.id}>
                    <div className="item-left">
                      <div className={`icon-box ${mov.tipo === "receita" ? "green" : "red"}`}>
                        <span className="material-symbols-outlined">
                          {mov.tipo === "receita"
                            ? "payments"
                            : CATEGORIA_ICONE[mov.categoria] || "more_horiz"}
                        </span>
                      </div>
                      <div>
                        <p className="title">{mov.nome}</p>
                        <p className="subtitle">
                          {formatDate(mov.data)} • {mov.categoria}
                        </p>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className={`value ${mov.tipo === "receita" ? "positive" : "negative"}`}>
                        {mov.tipo === "receita" ? "+" : "-"} {formatCurrency(mov.valor)}
                      </span>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(mov)}
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalTipo === "despesa" ? "Nova Despesa" : "Nova Receita"}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMovimentacao}>
              <div className="input-group">
                <label>Nome</label>
                <input
                  type="text"
                  placeholder={modalTipo === "despesa" ? "Ex: Almoço, Uber..." : "Ex: Salário, Freelance..."}
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={formValor}
                  onChange={(e) => setFormValor(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Data</label>
                <input
                  type="date"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  required
                />
              </div>

              {modalTipo === "despesa" && (
                <div className="input-group">
                  <label>Categoria</label>
                  <select
                    value={formCategoria}
                    onChange={(e) => setFormCategoria(e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    {categorias.map((cat) => (
                      <option key={cat.categoria_id} value={cat.categoria_id}>
                        {cat.nome_categoria}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className={`btn-submit ${modalTipo === "receita" ? "green" : "red"}`}
              >
                {modalTipo === "despesa" ? "Adicionar Despesa" : "Adicionar Receita"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;