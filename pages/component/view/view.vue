<template>
  <view>
    <page-head title="view"></page-head>
    <view class="uni-padding-wrap uni-common-mt">
      <button
        class="mini-btn"
        type="primary"
        size="mini"
        @click="Search"
      >按钮</button>
      <button
        class="mini-btn"
        type="primary"
        size="mini"
        @click="get2"
      >按钮2</button>

      <view class="">
        <uni-table
          border
          stripe
          emptyText="暂无更多数据"
        >
          <!-- 表头行 -->
          <uni-tr>
            <uni-th
              v-for="i in tableTitle"
              :key="i.title"
              :align="i.align || 'center'"
            >{{ i.title }}</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr
            v-for="i in data"
            :key="i.CODE"
          >
            <uni-td>{{ i.CODE }}</uni-td>
            <uni-td>{{ i.NAME }}</uni-td>
            <uni-td>{{ i.CATEGORY }}</uni-td>
            <uni-td>{{ i.CATEGORYDESC }}</uni-td>
          </uni-tr>
        </uni-table>
      </view>
    </view>
  </view>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  import { fundSearch, fundVarietieValuationDetail } from '@/api/apiStock.js'; // 根据实际路径引入
  // 使用 ref 创建单个响应式数据
  const count = ref(0);
  console.log(process.env.NODE_ENV)
  const data = ref([]);

  const tableTitle = ref([
    { title: '代码', width: '20%' },
    { title: '名称', width: '20%' },
    { title: 'CATEGORY', width: '20%' },
    { title: 'CATEGORYDESC', width: '20%' },
  ]);
  // 点击按钮的处理函数
  const Search = async () => {
    console.log('按钮被点击了');
    try {
      let p = { m: 1, key: '11' };
      // uni.request({
      //   url: 'http://localhost:3000/fundSearch',
      //   method: 'GET',
      //   data: p,
      //   success (res) {
      //     console.log(res);
      //   },
      //   fail (err) {
      //     console.log('获取openid失败：', err);
      //   }
      // })
      let res = await fundSearch(p);
      data.value = res.Datas;
      console.log(res);
    } catch (error) {
      console.error('请求出错:', error);
    }
  };
  const get2 = async () => {
    console.log('2按钮被点击了');
    try {
      let p = { FCODE: 160125 };
      let res = await fundVarietieValuationDetail(p);
      console.log(res);
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
