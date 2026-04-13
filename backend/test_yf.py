import yfinance as yf

# Format tickers for yfinance (brazilian stocks end with .SA)
tickers = "PETR4.SA VALE3.SA"

data = yf.Tickers(tickers)
for ticker in data.tickers.values():
    info = ticker.history(period="5d")
    if not info.empty:
        current_price = info['Close'].iloc[-1]
        prev_price = info['Close'].iloc[-2]
        change_pct = ((current_price - prev_price) / prev_price) * 100
        print(f"Ticker: {ticker.ticker}")
        print(f"Price: {current_price}")
        print(f"Change: {change_pct}%")
