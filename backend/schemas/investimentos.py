from pydantic import BaseModel
from typing import List, Optional

class SimulacaoRequest(BaseModel):
    tipo: str  # "cdb", "tesouro_selic", "poupanca"
    valor_inicial: float
    aporte_mensal: float
    taxa_anual: float  # % a.a. (ex: 13.25 para 13.25%)
    meses: int
    percentual_cdi: Optional[float] = 100.0  # apenas para CDB (ex: 110 = 110% do CDI)

class EvolucaoMensal(BaseModel):
    mes: int
    valor_acumulado: float
    rendimento_mensal: float
    total_investido: float
    rendimento_total: float

class SimulacaoResponse(BaseModel):
    tipo: str
    evolucao: List[EvolucaoMensal]
    valor_final: float
    total_investido: float
    rendimento_total: float
    rendimento_liquido: float  # após IR estimado
    ir_estimado: float

class CotacaoItem(BaseModel):
    symbol: str
    shortName: Optional[str] = None
    regularMarketPrice: Optional[float] = None
    regularMarketChangePercent: Optional[float] = None
    logourl: Optional[str] = None

class CotacoesResponse(BaseModel):
    results: List[CotacaoItem]
