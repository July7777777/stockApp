// const baseUrl='http://localhost:3000'
// 这里不能用 localhost               app会编译成 localhost/127.0.0.1:3000
// 也不能用 'http://127.0.0.1:3000'   app连不上电脑服务
const baseUrl = 'http://10.31.129.180:3000';

const defaultOptions = {
  url: baseUrl,
  method: 'GET',
  data: {},
  header: {
    'content-type': 'application/json',
  },
  dataType: 'json',
  responseType: 'text',
  success: () => {},
  fail: () => {},
  complete: () => {},
};
function request(options) {
  // 默认配置

  // 合并配置
  const mergedOptions = Object.assign({}, defaultOptions, options);
  // 发起请求
  uni.showLoading({ title: '加载中...' }); // 可选，根据需要显示加载提示
  return new Promise((resolve, reject) => {
    uni.request({
      ...mergedOptions,
      success: response => {
        resolve(response.data); // 成功回调
      },
      fail: error => {
        console.log(error);
        reject(error); // 失败回调
      },
      complete: () => {
        uni.hideLoading();
        // 请求完成后的操作，例如隐藏加载提示等可以在这里做
      },
    });
  });
}
export function get(url, data) {
  return request({ url: baseUrl + url, data, method: 'GET' });
}
export function post(url, data) {
  return request({ url: baseUrl + url, data, method: 'POST' });
}
