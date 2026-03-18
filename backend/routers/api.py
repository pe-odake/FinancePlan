# TESTE DO USO DA API

import os
from brapi import Brapi
from dotenv import load_dotenv
load_dotenv()

client = Brapi(
    api_key=os.getenv("BRAPI_API_KEY"),
)

# Buscar cotação
quote = client.quote.retrieve(tickers="PETR4")
print(quote.results[0].regular_market_price)

# Múltiplas ações
quotes = client.quote.retrieve(tickers="PETR4,VALE3,ITUB4")
for stock in quotes.results:
    print(f"{stock.symbol}: R$ {stock.regular_market_price}")

quote = client.quote.retrieve(tickers="PETR4")
stock = quote.results[0]
print(f"Símbolo: {stock.symbol}")
print(f"Nome: {stock.short_name}")
print(f"Preço: R$ {stock.regular_market_price}")
print(f"Variação: {stock.regular_market_change_percent}%")
# Com módulos adicionais
quote_with_data = client.quote.retrieve(
    tickers="PETR4",
    modules="summaryProfile,balanceSheetHistory"
)