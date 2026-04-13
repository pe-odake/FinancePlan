import API_URL from './apiConfig';

export const financeServiceInvestimentos = {
  // GET: BUSCAR COTAÇÕES
  getCotacoes: async (tickers) => {
    const response = await fetch(`${API_URL}/investimentos/cotacoes?tickers=${tickers}`);
    if (!response.ok) throw new Error("Erro ao buscar cotações");
    return response.json();
  },

  // POST: SIMULAR INVESTIMENTO
  simularInvestimento: async (dados) => {
    const response = await fetch(`${API_URL}/investimentos/simular`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao simular investimento");
    return response.json();
  },
};
