# The Portfolio Times
Static news-style dashboard: Bitcoin & silver (USD/NOK), your stocks, and stock news. Works on GitHub Pages (no backend).

## Edit your stocks
Open `config.js` and change the `stocks` list (`symbol` + `name`). Oslo Børs tickers use `.OL` (e.g. `EQNR.OL`).

## Data sources
- Bitcoin: CoinGecko (no key)
- Silver: gold-api.com (no key); NOK via open.er-api.com, fallback frankfurter.app (no key)
- Stocks & news: Finnhub — needs a free key (https://finnhub.io/register). Paste it in "Stock data settings" on the page; it's saved only in your browser. Note: Finnhub's free plan may not cover Oslo Børs (.OL) quotes.

Prices refresh every 60 s (`refreshSeconds`), news every 15 min.

## Publish on GitHub Pages
Push the files to a repo, then Settings → Pages → Deploy from branch `main` / root.
