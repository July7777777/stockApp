import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => ({
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
