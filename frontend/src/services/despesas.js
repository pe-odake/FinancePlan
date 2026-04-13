import API_URL from './apiConfig';

export const financeServiceDespesas = {
  // GET: BUSCAR DESPESAS DO USUÁRIO
  getDespesas: async (userId) => {
    const response = await fetch(`${API_URL}/despesas/?user_id=${userId}`);
    if (!response.ok) throw new Error("Erro ao buscar despesas");
    return response.json();
  },

  // POST: CRIAR DESPESA
  postDespesa: async (dados) => {
    const response = await fetch(`${API_URL}/despesas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao criar despesa");
    return response.json();
  },

  // DELETE: DELETAR DESPESA
  deleteDespesa: async (despesaId) => {
    const response = await fetch(`${API_URL}/despesas/${despesaId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar despesa");
  },
};