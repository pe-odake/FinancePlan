import API_URL from './apiConfig';

export const financeServiceCategorias = {
  // GET: BUSCAR CATEGORIAS
  getCategorias: async () => {
    const response = await fetch(`${API_URL}/categorias/`);
    if (!response.ok) throw new Error("Erro ao buscar categorias");
    return response.json();
  },
};
