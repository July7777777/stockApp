// 雪球token处理
// https://github.com/yangyang-hub/dss-data/blob/4367765db50b73fa5caf4e7abd625bfb013bd324/robot/xueqiu.go#L168

// https://blog.crackcreed.com/diy-xue-qiu-app-shu-ju-api/

const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const CookieJar = require('tough-cookie').CookieJar;
const moment = require('moment');

let xueqiuCookie = '';
let xueqiuCookieTime = 0;

// 获取当前日期字符串：YYYYMMDD
function getCurrentDate() {
  return moment().format('YYYYMMDD');
}

// 截取字符串
function substr(str, start, end) {
  return str.substring(start, end);
}

// 获取市场
function getMarket(code) {
  const prefix = substr(code, 0, 2);
  if (prefix === '60') return 'SHA';
  else if (prefix === '90') return 'SHB';
  else if (prefix === '00') return 'SZA';
  else if (prefix === '20') return 'SZB';
  else if (prefix === '30') return 'CY';
  else if (prefix === '68') return 'KC';
  else if (['43', '83', '87', '88'].includes(prefix)) return 'BJ';
  return '';
}

// 获取雪球 Cookie
async function getXueQiuCookie() {
  const now = Math.floor(Date.now() / 1000);
  if (now - xueqiuCookieTime > 600 || !xueqiuCookie) {
    const cookieJar = new CookieJar();
    const response = await axios.get('https://xueqiu.com', {
      jar: cookieJar,
      withCredentials: true,
    });
    const cookies = cookieJar.getCookiesSync('https://xueqiu.com');
    xueqiuCookie = cookies.map(c => `${c.key}=${c.value}`).join('; ');
    xueqiuCookieTime = now;
  }
  return xueqiuCookie;
}

// 访问 URL 并返回 JSON
async function visitXueQiuJson(url) {
  const cookie = await getXueQiuCookie();
  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: cookie,
        'User-Agent': 'Mozilla/5.0',
      },
    });
    return response.data;
  } catch (e) {
    console.error('Error fetching JSON:', e.message);
    return {};
  }
}

// 获取所有股票
async function getAllStock(page = 1, size = 60) {
  const result = [];
  const url = `https://stock.xueqiu.com/v5/stock/screener/quote/list.json?page=${page}&size=${size}&order=desc&orderby=percent&order_by=percent&market=CN&type=sh_sz`;
  const data = await visitXueQiuJson(url);

  const list = data?.data?.list || [];

  for (const item of list) {
    const stockInfo = {};
    for (const key in item) {
      switch (key) {
        case 'symbol':
          const s = item[key];
          const tsCode = s.toLowerCase();
          stockInfo.symbol = substr(tsCode, 2);
          stockInfo.tsCode = tsCode;
          stockInfo.exchange = substr(s, 0, 2);
          stockInfo.market = getMarket(stockInfo.symbol);
          break;
        case 'name':
          stockInfo.name = item[key];
          break;
      }
    }
    result.push(stockInfo);
  }

  // 递归分页获取
  const nextPage = page + 1;
  const nextData = await getAllStock(nextPage, size);
  return result.concat(nextData);
}

// 获取龙虎榜数据
async function getLonghu() {
  const result = [];
  const resultDetail = [];
  const date = getCurrentDate();
  const timestamp = Math.floor(moment(date, 'YYYYMMDD').valueOf());
  const url = `http://stock.xueqiu.com/v5/stock/hq/longhu.json?date=${timestamp}000`;

  const data = await visitXueQiuJson(url);
  const items = data?.data?.items || [];

  for (const ite of items) {
    const longhu = {
      tradeDate: date,
      id: uuidv4(),
    };

    for (const key in ite) {
      switch (key) {
        case 'symbol':
          longhu.symbol = substr(ite[key], 2);
          break;
        case 'name':
          longhu.name = ite[key];
          break;
        case 'close':
          longhu.close = ite[key];
          break;
        case 'percent':
          longhu.pctChg = ite[key];
          break;
        case 'volume':
          longhu.volume = ite[key] / 10000;
          break;
        case 'amount':
          longhu.amount = ite[key] / 10000;
          break;
        case 'type_name':
          longhu.type = ite[key].join(',');
          break;
      }
    }

    const details = await getLonghuDetail(ite.symbol, longhu.id);
    result.push(longhu);
    resultDetail.push(...details);
  }

  return { result, resultDetail };
}

// 获取龙虎榜详情
async function getLonghuDetail(symbol, longHuId) {
  const result = [];
  const url = `http://stock.xueqiu.com/v5/stock/capital/longhu.json?symbol=${symbol}&page=1&size=1`;
  const data = await visitXueQiuJson(url);
  const items = data?.data?.items || [];

  for (const item1 of items) {
    for (const item of item1) {
      const branches = item.branches || [];
      for (const branch of branches) {
        const detail = {
          longHuId,
        };
        for (const key in branch) {
          switch (key) {
            case 'branch_name':
              detail.dept = branch[key];
              break;
            case 'buy_amt':
              detail.buy = branch[key] / 10000;
              break;
            case 'sell_amt':
              detail.sell = branch[key] / 10000;
              break;
            case 'ratio':
              detail.ratio = branch[key];
              break;
            case 'net_amt':
              detail.netWorth = branch[key] / 10000;
              break;
          }
        }
        result.push(detail);
      }
    }
  }

  return result;
}

// 示例调用
(async () => {
  const stocks = await getAllStock();
  console.log('股票数量:', stocks.length);

  const { result, resultDetail } = await getLonghu();
  console.log('龙虎榜:', result);
  console.log('龙虎榜详情:', resultDetail);
})();
