import os
import httpx
from fastapi import APIRouter, HTTPException, Query
from schemas.investimentos import (
    SimulacaoRequest, SimulacaoResponse, EvolucaoMensal,
    CotacoesResponse, CotacaoItem
)
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/investimentos", tags=["Investimentos"])

BRAPI_API_KEY = os.getenv("BRAPI_API_KEY")
BRAPI_BASE_URL = "https://brapi.dev/api"


# ==================== COTAÇÕES VIA BRAPI ====================

@router.get("/cotacoes", response_model=CotacoesResponse)
async def buscar_cotacoes(tickers: str = Query(..., description="Tickers separados por vírgula, ex: PETR4,VALE3")):
    """Busca cotações de ações na B3 via Brapi API"""
    params = {"token": BRAPI_API_KEY}
    results = []

    # O plano gratuito da Brapi só permite 1 ticker por vez, então vamos iterar.
    ticker_list = [t.strip() for t in tickers.split(",") if t.strip()]

    async with httpx.AsyncClient(timeout=15.0) as client:
        for ticker in ticker_list:
            url = f"{BRAPI_BASE_URL}/quote/{ticker}"
            try:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    for stock in data.get("results", []):
                        results.append(CotacaoItem(
                            symbol=stock.get("symbol", ""),
                            shortName=stock.get("shortName", ""),
                            regularMarketPrice=stock.get("regularMarketPrice"),
                            regularMarketChangePercent=stock.get("regularMarketChangePercent"),
                            logourl=stock.get("logourl", ""),
                        ))
            except Exception as e:
                print(f"Erro ao buscar ticker {ticker}: {str(e)}")

    return CotacoesResponse(results=results)


# ==================== SIMULAÇÃO DE INVESTIMENTOS ====================

def calcular_ir(meses: int, rendimento: float, tipo: str) -> float:
    """Calcula IR regressivo sobre o rendimento de renda fixa / ações"""
    if tipo == "poupanca":
        return 0.0
    elif tipo == "acoes":
        return rendimento * 0.15  # 15% Swing Trade (simplificado)
        
    if meses <= 6:
        aliquota = 0.225  # 22.5%
    elif meses <= 12:
        aliquota = 0.20   # 20%
    elif meses <= 24:
        aliquota = 0.175  # 17.5%
    else:
        aliquota = 0.15   # 15%
    return rendimento * aliquota


@router.post("/simular", response_model=SimulacaoResponse)
async def simular_investimento(dados: SimulacaoRequest):
    """
    Simula investimentos:
    - CDB: rendimento baseado em % do CDI
    - Tesouro Selic: rendimento baseado na taxa Selic
    - Poupança: 70% da Selic quando Selic > 8.5%, senão 0.5% a.m. + TR
    - Ações: Projeto de renda variável usando taxa_anual esperada
    """

    tipo = dados.tipo.lower()
    valor_inicial = dados.valor_inicial
    aporte_mensal = dados.aporte_mensal
    taxa_anual = dados.taxa_anual / 100  # converter de % para decimal
    meses = dados.meses

    if tipo == "cdb":
        percentual = (dados.percentual_cdi or 100) / 100
        taxa_efetiva_anual = taxa_anual * percentual
    elif tipo == "tesouro_selic":
        taxa_efetiva_anual = taxa_anual + 0.001
    elif tipo == "poupanca":
        if taxa_anual > 0.085:
            taxa_efetiva_anual = taxa_anual * 0.70
        else:
            taxa_efetiva_anual = (1.005 ** 12) - 1
    elif tipo == "acoes":
        taxa_efetiva_anual = taxa_anual
    else:
        raise HTTPException(status_code=400, detail="Tipo de investimento inválido. Use: cdb, tesouro_selic, poupanca, acoes")

    # Taxa mensal equivalente (juros compostos)
    taxa_mensal = (1 + taxa_efetiva_anual) ** (1 / 12) - 1

    # Calcular evolução mês a mês
    evolucao = []
    saldo = valor_inicial
    total_investido = valor_inicial

    for mes in range(1, meses + 1):
        rendimento_mes = saldo * taxa_mensal
        saldo += rendimento_mes + aporte_mensal
        total_investido += aporte_mensal

        evolucao.append(EvolucaoMensal(
            mes=mes,
            valor_acumulado=round(saldo, 2),
            rendimento_mensal=round(rendimento_mes, 2),
            total_investido=round(total_investido, 2),
            rendimento_total=round(saldo - total_investido, 2),
        ))

    rendimento_total = saldo - total_investido
    ir = calcular_ir(meses, rendimento_total, tipo)
    rendimento_liquido = rendimento_total - ir

    return SimulacaoResponse(
        tipo=tipo,
        evolucao=evolucao,
        valor_final=round(saldo, 2),
        total_investido=round(total_investido, 2),
        rendimento_total=round(rendimento_total, 2),
        rendimento_liquido=round(rendimento_liquido, 2),
        ir_estimado=round(ir, 2),
    )
