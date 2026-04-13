import API_URL from './apiConfig';

export const financeServiceReceitas = {
  
  // GET: BUSCAR RECEITAS DO USUÁRIO
  getReceitas: async (userId) => {
    const response = await fetch(`${API_URL}/receitas/?user_id=${userId}`);
    if (!response.ok) throw new Error("Erro ao buscar receitas");
    return response.json();
  },

  // POST: CRIAR RECEITA
  postReceita: async (dados) => {
    const response = await fetch(`${API_URL}/receitas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error("Erro ao criar receita");
    return response.json();
  },

  // DELETE: DELETAR RECEITA
  deleteReceita: async (receitaId) => {
    const response = await fetch(`${API_URL}/receitas/${receitaId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar receita");
  },
};