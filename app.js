const C=window.PORTFOLIO,$=id=>document.getElementById(id);
const fmt=(n,c,d=2)=>new Intl.NumberFormat('en-US',{style:'currency',currency:c,maximumFractionDigits:d}).format(n);
const cls=n=>n>0?'up':n<0?'down':'';
async function j(u){const r=await fetch(u);if(!r.ok)throw new Error(r.status);return r.json();}
const key=()=>localStorage.getItem('finnhubKey')||'';
let nokRate=null;
async function fx(){try{const d=await j('https://open.er-api.com/v6/latest/USD');nokRate=d.rates.NOK;}catch{try{const d=await j('https://api.frankfurter.app/latest?from=USD&to=NOK');nokRate=d.rates.NOK;}catch{}}
 $('fx').textContent=nokRate?`USD/NOK ${nokRate.toFixed(3)}`:'FX data unavailable';}
async function btc(){try{const d=(await j('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,nok&include_24hr_change=true')).bitcoin;
 $('btc-usd').textContent=fmt(d.usd,'USD',0);$('btc-nok').textContent=fmt(d.nok,'NOK',0);
 const c=d.usd_24h_change;$('btc-chg').innerHTML=`<span class="${cls(c)}">${c>0?'▲':'▼'} ${c.toFixed(2)}% (24h)</span>`;}
 catch{$('btc-usd').innerHTML='<span class="na">Data unavailable</span>';$('btc-nok').textContent='';}}
async function silver(){try{const d=await j('https://api.gold-api.com/price/XAG');$('xag-usd').textContent=fmt(d.price,'USD');
 $('xag-nok').textContent=nokRate?fmt(d.price*nokRate,'NOK'):'NOK unavailable';}catch{$('xag-usd').innerHTML='<span class="na">Data unavailable</span>';}}
async function stocks(){const k=key(),tb=$('stocks');
 $('keynote').textContent=k?'':'Stock prices and news need a free Finnhub API key — add one under settings below.';
 tb.innerHTML=C.stocks.map(s=>`<tr id="r-${s.symbol.replace('.','_')}"><td>${s.name}</td><td>${s.symbol}</td><td colspan="3" class="na">${k?'Loading…':'Data unavailable (no API key)'}</td></tr>`).join('');
 if(!k)return;
 for(const s of C.stocks){const row=$('r-'+s.symbol.replace('.','_'));
  try{const q=await j(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(s.symbol)}&token=${k}`);
   if(!q.c)throw 0;const cur=s.symbol.endsWith('.OL')?'NOK':'USD';
   row.innerHTML=`<td>${s.name}</td><td>${s.symbol}</td><td>${fmt(q.c,cur)}</td><td class="${cls(q.d)}">${q.d>0?'+':''}${q.d.toFixed(2)}</td><td class="${cls(q.dp)}">${q.dp>0?'+':''}${q.dp.toFixed(2)}%</td>`;}
  catch{row.innerHTML=`<td>${s.name}</td><td>${s.symbol}</td><td colspan="3" class="na">Data unavailable (free plan may not cover this exchange)</td>`;}}}
async function news(){const k=key(),el=$('news');
 if(!k){el.innerHTML='<p class="na">News unavailable — add a Finnhub API key to load company news.</p>';return;}
 const to=new Date(),from=new Date(Date.now()-7*864e5),d=x=>x.toISOString().slice(0,10);let h='';
 for(const s of C.stocks){h+=`<div class="kicker">${s.name}</div>`;
  try{const n=(await j(`https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(s.symbol)}&from=${d(from)}&to=${d(to)}&token=${k}`)).slice(0,C.newsPerStock);
   h+=n.length?n.map(a=>`<div class="story"><h4><a href="${a.url}" target="_blank" rel="noopener">${a.headline}</a></h4><div class="src">${a.source} · ${new Date(a.datetime*1000).toLocaleString()}</div><p>${(a.summary||'').slice(0,220)}</p></div>`).join(''):'<p class="na">No recent news.</p>';}
  catch{h+='<p class="na">News unavailable.</p>';}}
 el.innerHTML=h;}
async function refresh(){await fx();await Promise.all([btc(),silver(),stocks()]);$('updated').textContent='Updated '+new Date().toLocaleTimeString();}
$('today').textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
$('key').value=key();
$('save').onclick=()=>{localStorage.setItem('finnhubKey',$('key').value.trim());refresh();news();};
$('clear').onclick=()=>{localStorage.removeItem('finnhubKey');$('key').value='';refresh();news();};
refresh();news();setInterval(refresh,C.refreshSeconds*1000);setInterval(news,15*60*1000);
