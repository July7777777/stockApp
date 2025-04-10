import { useCounterStore } from '@/store/counter';

// 移除 const baseUrl = counterStore.baseUrl;

const defaultOptions = {
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
  const counterStore = useCounterStore();
  const baseUrl = counterStore.baseUrl;

  // 默认配置

  // 合并配置
  const mergedOptions = Object.assign({}, defaultOptions, options);
  mergedOptions.url = baseUrl + mergedOptions.url;

  // 发起请求
  uni.showLoading({ title: '加载中...' }); // 可选，根据需要显示加载提示
  return new Promise((resolve, reject) => {
    uni.request({
      ...mergedOptions,
      success: response => {
        resolve(response.data); // 成功回调
      },
      fail: err => {
        console.log(err);
        reject({
          success: false,
          message: err.errMsg&&err.errMsg||'请求失败',
        }); // 失败回调
      },
      complete: () => {
        uni.hideLoading();
        // 请求完成后的操作，例如隐藏加载提示等可以在这里做
      },
    });
  });
}

export function get(url, data) {
  return request({ url, data, method: 'GET' });
}

export function post(url, data) {
  return request({ url, data, method: 'POST' });
}
