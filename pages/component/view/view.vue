<template>
  <view>
    <page-head title="view"></page-head>
    <view class="uni-padding-wrap uni-common-mt">
      <button class="mini-btn" type="primary" size="mini" @click="Search">按钮</button>
      <view class="" v-for="i in 3">
        {{ i }}
      </view>
    </view>
  </view>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  import { fundSearch } from '@/api/apiStock.js'; // 根据实际路径引入
  // 使用 ref 创建单个响应式数据
  const count = ref(0);

  // 点击按钮的处理函数
  const Search = async () => {
    console.log('按钮被点击了');
    try {
      console.log(fundSearch({ m: 1, key: '11' }));
      let res = await fundSearch({ m: 1, key: '11' });
      console.log('GET 请求成功:', res);
    } catch (error) {
      console.error('请求出错:', error);
    }
  };
</script>

<style>
  .flex-item {
    width: 33.3%;
    height: 200rpx;
    text-align: center;
    line-height: 200rpx;
  }

  .flex-item-V {
    width: 100%;
    height: 150rpx;
    text-align: center;
    line-height: 150rpx;
  }

  .text {
    margin: 15rpx 10rpx;
    padding: 0 20rpx;
    background-color: #ebebeb;
    height: 70rpx;
    line-height: 70rpx;
    text-align: center;
    color: #777;
    font-size: 26rpx;
  }

  .desc {
    /* text-indent: 40rpx; */
  }

  .flex-pc {
    display: flex;
    justify-content: center;
  }
</style>
