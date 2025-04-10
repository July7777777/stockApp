import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => ({
    // baseUrl:'http://127.0.0.1:3000',// 全局接口地址
    baseUrl:'',// 全局接口地址
    count: 0
  }),


  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  }
})
