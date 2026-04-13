import { useContext, useEffect, useState } from "react";
import "../css/Simulador.css";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { financeServiceInvestimentos } from "../services/investimentos";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const TIPOS_INVESTIMENTO = [
  { id: "cdb", nome: "CDB", icon: "account_balance", desc: "Certificado de Depósito Bancário" },
  { id: "tesouro_selic", nome: "Tesouro Selic", icon: "assured_workload", desc: "Título público federal" },
  { id: "poupanca", nome: "Poupança", icon: "savings", desc: "Caderneta de Poupança" },
  { id: "acoes", nome: "Ações", icon: "trending_up", desc: "Simulação de Renda Variável" },
];

const TICKERS_PADRAO = "PETR4,VALE3,ITUB4,BBAS3,WEGE3";

function Simulador() {
  const { authenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Simulação
  const [tipoSelecionado, setTipoSelecionado] = useState("cdb");
  const [valorInicial, setValorInicial] = useState("1000");
  const [aporteMensal, setAporteMensal] = useState("500");
  const [taxaAnual, setTaxaAnual] = useState("13.25");
  const [meses, setMeses] = useState("12");
  const [percentualCdi, setPercentualCdi] = useState("100");
  const [tickerSimulacao, setTickerSimulacao] = useState("");
  const [acaoSelecionada, setAcaoSelecionada] = useState("");
  const [resultado, setResultado] = useState(null);
  const [simulando, setSimulando] = useState(false);

  // Cotações
  const [cotacoes, setCotacoes] = useState([]);
  const [tickerBusca, setTickerBusca] = useState("");
  const [loadingCotacoes, setLoadingCotacoes] = useState(true);
  const [erroCotacoes, setErroCotacoes] = useState("");

  useEffect(() => {
    document.title = "FinancePlan - Simulador de Investimentos";
    if (!loading && !authenticated) {
      navigate("/login");
    }

    if (authenticated) {
      carregarCotacoes(TICKERS_PADRAO);
    }
  }, [authenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="simulador-page">
        <Header />
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  // ==================== HANDLERS ====================

  async function carregarCotacoes(tickers) {
    setLoadingCotacoes(true);
    setErroCotacoes("");
    try {
      const data = await financeServiceInvestimentos.getCotacoes(tickers);
      if (tickers === TICKERS_PADRAO) {
        setCotacoes(data.results || []);
      } else {
        // Move as cotações buscadas para o topo, mesmo que já existissem na lista
        setCotacoes((prev) => {
          const searchResults = data.results || [];
          const searchSymbols = searchResults.map(r => r.symbol);
          const filteredPrev = prev.filter(p => !searchSymbols.includes(p.symbol));
          return [...searchResults, ...filteredPrev];
        });
      }
    } catch (error) {
      setErroCotacoes("Erro ao buscar cotações. Tente novamente.");
    } finally {
      setLoadingCotacoes(false);
    }
  }

  async function handleBuscarTicker(e) {
    e.preventDefault();
    if (!tickerBusca.trim()) return;
    await carregarCotacoes(tickerBusca.toUpperCase().trim());
    setTickerBusca("");
  }

  async function handlePesquisarAcaoSimulacao() {
    if (!tickerSimulacao.trim()) return;
    const ticker = tickerSimulacao.toUpperCase().trim();
    await carregarCotacoes(ticker);
    setAcaoSelecionada(ticker);
  }

  async function handleSimular(e) {
    e.preventDefault();
    setSimulando(true);

    try {
      const dados = {
        tipo: tipoSelecionado,
        valor_inicial: parseFloat(valorInicial),
        aporte_mensal: parseFloat(aporteMensal),
        taxa_anual: parseFloat(taxaAnual),
        meses: parseInt(meses),
        percentual_cdi: tipoSelecionado === "cdb" ? parseFloat(percentualCdi) : 100,
      };

      const data = await financeServiceInvestimentos.simularInvestimento(dados);
      setResultado(data);
    } catch (error) {
      console.error("Erro na simulação:", error);
    } finally {
      setSimulando(false);
    }
  }

  // ==================== CHART DATA ====================
  const chartData = resultado
    ? {
        labels: resultado.evolucao.map((e) => `Mês ${e.mes}`),
        datasets: [
          {
            label: "Valor Acumulado",
            data: resultado.evolucao.map((e) => e.valor_acumulado),
            borderColor: "#22c55e",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 2.5,
          },
          {
            label: "Total Investido",
            data: resultado.evolucao.map((e) => e.total_investido),
            borderColor: "#94a3b8",
            backgroundColor: "rgba(148, 163, 184, 0.05)",
            fill: true,
            tension: 0.3,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 2,
            borderDash: [5, 5],
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          callback: (value) => formatCurrency(value),
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="simulador-page">
      <Header />

      <main className="simulador-container">
        <h2 className="page-title">Simulação de Investimentos</h2>
        <p className="page-subtitle">
          Simule rendimentos de renda fixa e acompanhe cotações da B3
        </p>

        <div className="sim-layout">
          {/* ==================== COLUNA ESQUERDA ==================== */}
          <div className="sim-left">
            {/* Tipo de investimento */}
            <div className="card">
              <h4 className="section-title">Tipo de Investimento</h4>
              <div className="tipo-grid">
                {TIPOS_INVESTIMENTO.map((tipo) => (
                  <button
                    key={tipo.id}
                    className={`tipo-card ${tipoSelecionado === tipo.id ? "active" : ""}`}
                    onClick={() => setTipoSelecionado(tipo.id)}
                  >
                    <span className="material-symbols-outlined tipo-icon">{tipo.icon}</span>
                    <span className="tipo-nome">{tipo.nome}</span>
                    <span className="tipo-desc">{tipo.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="card">
              <h4 className="section-title">Parâmetros</h4>
              <form onSubmit={handleSimular} className="sim-form">
                <div className="sim-input-row">
                  <div className="sim-input-group">
                    <label>Valor Inicial (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={valorInicial}
                      onChange={(e) => setValorInicial(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sim-input-group">
                    <label>Aporte Mensal (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={aporteMensal}
                      onChange={(e) => setAporteMensal(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="sim-input-row">
                  <div className="sim-input-group">
                    <label>Taxa Anual (%)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={taxaAnual}
                      onChange={(e) => setTaxaAnual(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sim-input-group">
                    <label>Prazo (meses)</label>
                    <input
                      type="number"
                      min="1"
                      max="360"
                      value={meses}
                      onChange={(e) => setMeses(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {tipoSelecionado === "cdb" && (
                  <div className="sim-input-group full">
                    <label>Percentual do CDI (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      step="0.1"
                      value={percentualCdi}
                      onChange={(e) => setPercentualCdi(e.target.value)}
                      required
                    />
                  </div>
                )}

                {tipoSelecionado === "acoes" && (
                  <div className="sim-input-group full">
                    <label>Pesquisar e Selecionar Ação</label>
                    <div className="sim-search-box">
                      <input
                        type="text"
                        placeholder="Ex: PETR4, VALE3..."
                        value={tickerSimulacao}
                        onChange={(e) => setTickerSimulacao(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handlePesquisarAcaoSimulacao();
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-search-sim"
                        onClick={handlePesquisarAcaoSimulacao}
                        title="Buscar Ação"
                      >
                        <span className="material-symbols-outlined">search</span>
                      </button>
                    </div>
                    {acaoSelecionada && (
                      <div className="acao-selecionada-badge">
                        <span className="material-symbols-outlined">check_circle</span>
                        Selecionado: <strong>{acaoSelecionada}</strong>
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" className="btn-simular" disabled={simulando}>
                  {simulando ? "Simulando..." : "Simular Investimento"}
                </button>
              </form>
            </div>
          </div>

          {/* ==================== COLUNA DIREITA ==================== */}
          <div className="sim-right">
            {/* Resultado da simulação */}
            {resultado ? (
              <>
                <div className="card">
                  <h4 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Resultado da Simulação
                    {resultado.tipo === "acoes" && acaoSelecionada && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>
                        •
                        {cotacoes.find((c) => c.symbol === acaoSelecionada)?.logourl && (
                          <img 
                            src={cotacoes.find((c) => c.symbol === acaoSelecionada)?.logourl} 
                            alt={acaoSelecionada} 
                            style={{ height: '20px', width: 'auto', borderRadius: '4px' }} 
                          />
                        )}
                        {acaoSelecionada}
                      </span>
                    )}
                  </h4>
                  <div className="resultado-cards">
                    <div className="resultado-item">
                      <span className="resultado-label">Valor Final</span>
                      <span className="resultado-valor green">{formatCurrency(resultado.valor_final)}</span>
                    </div>
                    <div className="resultado-item">
                      <span className="resultado-label">Total Investido</span>
                      <span className="resultado-valor">{formatCurrency(resultado.total_investido)}</span>
                    </div>
                    <div className="resultado-item">
                      <span className="resultado-label">Rendimento Bruto</span>
                      <span className="resultado-valor green">{formatCurrency(resultado.rendimento_total)}</span>
                    </div>
                    <div className="resultado-item">
                      <span className="resultado-label">IR Estimado</span>
                      <span className="resultado-valor red">{formatCurrency(resultado.ir_estimado)}</span>
                    </div>
                    <div className="resultado-item destaque">
                      <span className="resultado-label">Rendimento Líquido</span>
                      <span className="resultado-valor green">{formatCurrency(resultado.rendimento_liquido)}</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="section-title">Evolução do Patrimônio</h4>
                  <div className="chart-wrapper">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </>
            ) : (
              <div className="card sim-placeholder">
                <span className="material-symbols-outlined">insights</span>
                <h4>Simule seu investimento</h4>
                <p>Preencha os parâmetros ao lado e clique em "Simular" para visualizar a evolução do seu patrimônio.</p>
              </div>
            )}
          </div>
        </div>

        {/* ==================== COTAÇÕES ==================== */}
        <div className="card cotacoes-section">
          <div className="cotacoes-header">
            <div>
              <h4 className="section-title">Cotações da B3</h4>
              <p className="cotacoes-subtitle">Acompanhe ações em tempo real via Brapi</p>
            </div>

            <form onSubmit={handleBuscarTicker} className="ticker-search">
              <input
                type="text"
                placeholder="Buscar ticker (ex: PETR4)"
                value={tickerBusca}
                onChange={(e) => setTickerBusca(e.target.value)}
              />
              <button type="submit">
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
          </div>

          {erroCotacoes && <div className="form-error">{erroCotacoes}</div>}

          {loadingCotacoes ? (
            <div className="cotacoes-loading">Carregando cotações...</div>
          ) : (
            <div className="cotacoes-grid">
              {cotacoes.map((stock) => (
                <div key={stock.symbol} className="cotacao-card">
                  <div className="cotacao-top">
                    <div className="cotacao-info">
                      <span className="cotacao-symbol" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {stock.logourl && (
                          <img 
                            src={stock.logourl} 
                            alt={stock.symbol} 
                            style={{ height: '18px', width: 'auto', borderRadius: '4px' }} 
                          />
                        )}
                        {stock.symbol}
                      </span>
                    </div>
                    <span className={`cotacao-badge ${(stock.regularMarketChangePercent || 0) >= 0 ? "positive" : "negative"}`}>
                      <span className="material-symbols-outlined">
                        {(stock.regularMarketChangePercent || 0) >= 0 ? "trending_up" : "trending_down"}
                      </span>
                      {(stock.regularMarketChangePercent || 0).toFixed(2)}%
                    </span>
                  </div>
                  <div className="cotacao-price">
                    {stock.regularMarketPrice
                      ? formatCurrency(stock.regularMarketPrice)
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* ==================== COTAÇÕES DE MOEDAS (PLACEHOLDER) ==================== */}
        <div className="card cotacoes-section" style={{ marginTop: '20px' }}>
          <h4 className="section-title">Cotação de Moedas</h4>
          <div className="sim-placeholder" style={{ minHeight: '150px', padding: '20px' }}>
            <p style={{ marginTop: '10px', fontSize: '15px', fontWeight: 'bold', color: '#64748b' }}>
              Em produção...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Simulador;