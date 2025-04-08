const baseURL = 'localhost:3000';
// const baseURL = '10.31.129.180:3000';

class Http {
  constructor() {
    // 默认配置
    this.config = {
      baseURL,
      timeout: 10000,
      header: {
        'Content-Type': 'application/json',
      },
    };
  }

  // 请求方法
  async request(options) {
    let config = { ...this.config, ...options };

    // 发送请求
    return new Promise((resolve, reject) => {
      uni.request({
        ...config,
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        },
      });
    });
  }

  // GET请求
  get(url, params = {}, options = {}) {
    console.log('get',url,params,options,)
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...options,
    });
  }

  // POST请求
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options,
    });
  }
}

// 创建实例
const http = new Http();

// 设置请求拦截器
// http.setRequestInterceptor(config => {
//   // config.header.Authorization = 'Bearer token';
//   return config;
// });

// 设置响应拦截器
// http.setResponseInterceptor(response => {
//   if (response.statusCode !== 200) {
//     uni.showToast({
//       title: '请求失败',
//       icon: 'none',
//     });
//   }
//   return response.data;
// });
console.log(http.get)
// 直接导出get和post方法
// export const get = http.get.bind(http);
// export const post = http.post.bind(http);
export default http;
