# FinancePlan

## Sobre o Projeto
Este é um projeto pessoal desenvolvido com o propósito de consolidar conhecimentos em desenvolvimento Fullstack, explorando a integração entre uma API de alta performance e um ecossistema de interface reativo.

**Gestão de Fluxo de Caixa:** Uma calculadora financeira completa para o dia a dia, permitindo o registro detalhado de receitas (salários, rendas extras) e despesas (custos fixos, lazer), gerando um panorama real de quanto sobra no final do mês.

**Simulação de Investimentos Ativa:** Diferente de planilhas estáticas, o sistema utiliza dados reais de mercado (via APIs externas) para simular o crescimento do patrimônio em ativos da B3 ou em renda fixa (CDB/Selic), ajudando o usuário a decidir onde alocar o excedente do seu fluxo de caixa.

## Foco de Aperfeiçoamento:
*   **FastAPI:** Implementação de rotas assíncronas, manipulação de banco de dados relacional com SQLAlchemy e integração com APIs externas de finanças.
*   **React.js:** Gerenciamento de estado complexo, criação de interfaces responsivas e visualização de dados dinâmicos com gráficos.
*   **Arquitetura:** Estruturação de um sistema escalável que consome dados reais (B3/Selic) para fornecer insights úteis de planejamento financeiro.

## Funcionalidades
*   Registro e autenticação de usuários.
*   Cadastro e gerenciamento de receitas e despesas.
*   Visualização de fluxo de caixa mensal.
*   Simulação de investimentos com dados de mercado (B3, CDB/Selic).

## Tecnologias

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-005571?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Como Rodar

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
*   Python 3.9+
*   Node.js 18+
*   npm ou yarn

### Backend
1.  Navegue até o diretório `backend`:
    ```bash
    cd backend
    ```
2.  Crie e ative um ambiente virtual (opcional, mas recomendado):
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    .\venv\Scripts\activate    # Windows
    ```
3.  Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
4.  Execute a aplicação FastAPI:
    ```bash
    uvicorn main:app --reload
    ```
    A API estará disponível em `http://127.0.0.1:8000`.

### Frontend
1.  Navegue até o diretório `frontend`:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou yarn install
    ```
3.  Inicie a aplicação React:
    ```bash
    npm run dev
    # ou yarn dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

## Link do Repositório
[https://github.com/pe-odake/FinancePlan](https://github.com/pe-odake/FinancePlan)
