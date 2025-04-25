import {get,post} from './http.js';
// https://kouchao.github.io/TiantianFundApi/apis/#%E5%9F%BA%E9%87%91%E6%90%9C%E7%B4%A2


/**
 *  m 搜索类别
 * 搜基金: 1
 * 按字母公司搜基金: 3
 * 搜基金经理: 7
 * 搜基金公司: 8
 * key: 关键字，当值为3时,仅a-z有效
 * @param {m,key}
 *
 * @returns
 */

// 例如/fundSearch?m=1&key=11
export const fundSearch = params => get('/fundSearch', params);

// 获取基金净值估算-实时   FCODE 基金code
export const fundVarietieValuationDetail = params => get('/fundVarietieValuationDetail', params);

// 获取指数LOF列表 参数 ___jsl=LST___t=1745567060341&rp=25&page=1    only_owned暂未不可用
export const indexLofList = params => get('/indexLofList', params);

// 获取股票LOF列表 参数 ___jsl=LST___t=1745568051745&only_owned=&rp=25    only_owned暂未不可用
export const stockLofList = params => get('/stockLofList', params);